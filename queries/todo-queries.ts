import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import type { TodoItem } from "@/lib/types";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  type UpdateTodoParams,
} from "@/services/todo-service";

const TODOS_KEY = ["todos"] as const;

export function useTodosQuery(): UseQueryResult<TodoItem[]> {
  return useQuery({
    queryKey: TODOS_KEY,
    queryFn: fetchTodos,
  });
}

export function useCreateTodoMutation(): UseMutationResult<
  TodoItem,
  Error,
  string
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => createTodo(text),
    onSuccess: (newItem) => {
      queryClient.setQueryData<TodoItem[]>(TODOS_KEY, (old) =>
        old ? [...old, newItem] : [newItem]
      );
    },
  });
}

export function useUpdateTodoMutation(): UseMutationResult<
  TodoItem,
  Error,
  UpdateTodoParams,
  { previous: TodoItem[] | undefined }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateTodoParams) => updateTodo(params),
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: TODOS_KEY });
      const previous = queryClient.getQueryData<TodoItem[]>(TODOS_KEY);

      queryClient.setQueryData<TodoItem[]>(TODOS_KEY, (old) =>
        old?.map((item) =>
          item.id === params.id
            ? {
                ...item,
                ...(params.text !== undefined && { text: params.text }),
                ...(params.completed !== undefined && {
                  completed: params.completed,
                  completedAt: params.completed
                    ? new Date().toISOString()
                    : null,
                }),
              }
            : item
        )
      );

      return { previous };
    },
    onError: (_err, _params, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TODOS_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}

export function useDeleteTodoMutation(): UseMutationResult<
  void,
  Error,
  string,
  { previous: TodoItem[] | undefined }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TODOS_KEY });
      const previous = queryClient.getQueryData<TodoItem[]>(TODOS_KEY);

      queryClient.setQueryData<TodoItem[]>(TODOS_KEY, (old) =>
        old?.filter((item) => item.id !== id)
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TODOS_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}
