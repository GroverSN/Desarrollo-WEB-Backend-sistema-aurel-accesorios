import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Producto } from '../services/productos'

export interface CarritoItem {
  producto: Producto
  cantidad: number
}

export const useCarritoStore = defineStore('carrito', () => {
  const items = ref<CarritoItem[]>(loadFromStorage())

  function loadFromStorage(): CarritoItem[] {
    try {
      const saved = localStorage.getItem('aurel_carrito')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  }

  function saveToStorage() {
    localStorage.setItem('aurel_carrito', JSON.stringify(items.value))
  }

  const totalItems = computed(() =>
    items.value.reduce((sum, i) => sum + i.cantidad, 0)
  )

  const totalPrecio = computed(() =>
    items.value.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0)
  )

  function agregar(producto: Producto, cantidad = 1) {
    if (producto.stock <= 0) return
    const existente = items.value.find(i => i.producto.id === producto.id)
    if (existente) {
      const nueva = Math.min(existente.cantidad + cantidad, producto.stock)
      existente.cantidad = nueva
    } else {
      items.value.push({ producto, cantidad: Math.min(cantidad, producto.stock) })
    }
    saveToStorage()
  }

  function quitar(productoId: number) {
    items.value = items.value.filter(i => i.producto.id !== productoId)
    saveToStorage()
  }

  function incrementar(productoId: number) {
    const item = items.value.find(i => i.producto.id === productoId)
    if (item && item.cantidad < item.producto.stock) {
      item.cantidad++
      saveToStorage()
    }
  }

  function decrementar(productoId: number) {
    const item = items.value.find(i => i.producto.id === productoId)
    if (item) {
      if (item.cantidad <= 1) {
        quitar(productoId)
      } else {
        item.cantidad--
        saveToStorage()
      }
    }
  }

  function vaciar() {
    items.value = []
    saveToStorage()
  }

  function obtenerCantidad(productoId: number): number {
    return items.value.find(i => i.producto.id === productoId)?.cantidad ?? 0
  }

  return {
    items, totalItems, totalPrecio,
    agregar, quitar, incrementar, decrementar, vaciar, obtenerCantidad,
  }
})
