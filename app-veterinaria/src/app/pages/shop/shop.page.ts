import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../service/productos.service';
import { CategoriasService } from '../../service/categorias.service';

interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_venta: number;
  stock: number;
  categoria_id?: number;
  imagen_url?: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface CartItem extends Product {
  quantity: number;
}

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
  standalone: false
})
export class ShopPage implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Categoria[] = [{ id: 0, nombre: 'Todos los productos' }];
  selectedCategory = 0;
  searchTerm = '';
  loading = true;

  cart: CartItem[] = [];
  isCartOpen = false;

  readonly IMG_BASE_URL = 'http://192.168.1.17:3000/';

  constructor(
    private productosService: ProductosService,
    private categoriasService: CategoriasService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.productosService.obtenerTodos().subscribe((productos) => {
      this.products = productos;
      this.filteredProducts = productos;
      this.loading = false;
    });

    this.categoriasService.obtenerTodas().subscribe((categorias) => {
      this.categories = [{ id: 0, nombre: 'Todos los productos' }, ...categorias];
    });
  }

  filterProducts() {
    let result = this.products;
    if (this.selectedCategory !== 0) {
      result = result.filter(p => p.categoria_id === this.selectedCategory);
    }
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(
        p => p.nombre.toLowerCase().includes(term) ||
             (p.descripcion && p.descripcion.toLowerCase().includes(term))
      );
    }
    this.filteredProducts = result;
  }

  addToCart(product: Product) {
    const idx = this.cart.findIndex(item => item.id === product.id);
    if (idx > -1) {
      this.cart[idx].quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
  }

  updateQuantity(productId: number, newQuantity: number) {
    const idx = this.cart.findIndex(item => item.id === productId);
    if (idx > -1) {
      if (newQuantity < 1) {
        this.cart.splice(idx, 1);
      } else {
        this.cart[idx].quantity = newQuantity;
      }
    }
  }

  removeFromCart(productId: number) {
    this.cart = this.cart.filter(item => item.id !== productId);
  }

  get cartTotal() {
    return this.cart.reduce((sum, item) => sum + item.precio_venta * item.quantity, 0);
  }
}
