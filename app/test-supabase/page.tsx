import { createClient } from '@/utils/supabase/server'

export default async function Page() {
  const supabase = await createClient()

  // Note: This expects a 'todos' table to exist in your Supabase database
  const { data: todos, error } = await supabase.from('todos').select()

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold text-red-500">Error Fetching Todos</h1>
        <p>{error.message}</p>
        <p className="mt-2 text-sm text-gray-500">
          Make sure you have a "todos" table in your Supabase project.
        </p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      {todos && todos.length > 0 ? (
        <ul className="list-disc pl-5">
          {todos.map((todo: any) => (
            <li key={todo.id}>{todo.name}</li>
          ))}
        </ul>
      ) : (
        <p>No todos found. If the connection is successful but the list is empty, ensure you have data in your "todos" table.</p>
      )}
    </div>
  )
}
