import { defineStore } from "pinia";
import { ref } from "vue";
import { IBook } from "@/interfaces";
const baseUrl = "http://localhost:3001/api/books";

export const useBooksStore = defineStore("booksStore", () => {
  const rows = ref<IBook[]>([])
  const totalRows = ref(0)
  
  const getItems = async () => {
    try {
      const response = await fetch(`${baseUrl}`)
      const data = await response.json()
      rows.value = data
      totalRows.value = data.length
    } catch (error) {
      console.error(error)
    }
  }

  const getBookById = async (id: number) => {
    try {
      const response = await fetch(`${baseUrl}/${id}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error(error)
    }
  }

  const addBook = async (book: IBook) => {
    try {
      const response = await fetch(`${baseUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(book)
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error(error)
    }
  }

  const updateItem = async (book: IBook) => {
    try {
      const response = await fetch(`${baseUrl}/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(book)
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error(error)
    }
  }

  const deleteItem = async (id: number) => {
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE"
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error(error)
    }
  }

  return {
    rows,
    totalRows,
    getItems,
    addBook,
    updateItem,
    deleteItem,
    getBookById
   }

})