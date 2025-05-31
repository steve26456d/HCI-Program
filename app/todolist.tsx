"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"
import { useState, useEffect } from "react"

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}
export default function Component() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")

  // 从本地存储加载数据
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
        }))
        setTodos(parsedTodos)
      } catch (error) {
        console.error("Error loading todos from localStorage:", error)
      }
    }
  }, [])

  // 保存数据到本地存储
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  // 添加新的待办事项
  const addTodo = () => {
    if (newTodo.trim() !== "") {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date(),
      }
      setTodos([todo, ...todos])
      setNewTodo("")
    }
  }

  // 切换完成状态
  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  // 删除待办事项
  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  // 清除所有已完成的任务
  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  const completedCount = todos.filter((todo) => todo.completed).length
  const totalCount = todos.length

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">待办事项清单</CardTitle>
          <div className="text-center text-sm text-muted-foreground">
            总计: {totalCount} | 已完成: {completedCount} | 待完成: {totalCount - completedCount}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 添加新任务 */}
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="输入新的待办事项..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTodo()
                }
              }}
              className="flex-1"
            />
            <Button onClick={addTodo} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* 清除已完成按钮 */}
          {completedCount > 0 && (
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={clearCompleted} className="text-xs">
                清除已完成 ({completedCount})
              </Button>
            </div>
          )}

          {/* 待办事项列表 */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {todos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">暂无待办事项，添加一个开始吧！</div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-sm ${
                    todo.completed
                      ? "bg-muted/50 border-muted"
                      : "bg-background border-border hover:border-muted-foreground/20"
                  }`}
                >
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={`block cursor-pointer ${
                        todo.completed ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {todo.text}
                    </label>
                    <div className="text-xs text-muted-foreground mt-1">{todo.createdAt.toLocaleString("zh-CN")}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTodo(todo.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    aria-label="删除任务"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
