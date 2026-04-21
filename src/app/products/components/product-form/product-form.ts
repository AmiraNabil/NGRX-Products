import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductStore } from '../../store/product.store';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateProduct } from '../../models/product.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
  standalone: true,
})
export class ProductForm implements OnInit {
  store = inject(ProductStore);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private paramMap = toSignal(this.route.paramMap);
  readonly productId = computed(() => this.paramMap()?.get('id'));
  readonly isEdit = computed(() => !!this.productId());

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
    categoryId: [1, Validators.required],
    imageUrl: ['https://placehold.net/4.png'],
  });

  constructor() {
    effect(() => {
      const selected = this.store.selected();
      if (selected && this.isEdit()) {
        this.form.patchValue({
          title: selected.title,
          price: selected.price,
          description: selected.description,
          categoryId: selected.category.id,
          imageUrl: selected.images?.[0] ?? 'https://placehold.net/4.png',
        });
      }
    });
  }

  ngOnInit() {
    if (this.isEdit() && !this.store.selected()) {
      this.router.navigate(['/products']);
    }
  }

  get loading() {
    return this.store.loading();
  }

  isInvalid(field: string) {
    const input = this.form.get(field);
    return input?.invalid && input.touched;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const data: CreateProduct = {
      title: value.title!,
      price: Number(value.price),
      description: value.description!,
      categoryId: Number(value.categoryId),
      images: [value.imageUrl ?? 'https://placehold.net/4.png'],
    };

    if (this.isEdit() && this.store.selected()) {
      this.store.updateProduct({ id: this.store.selected()!.id, data });
    } else {
      this.store.createProduct(data);
    }

    this.goBack();
  }

  goBack() {
    this.store.clearProduct();
    this.router.navigate(['/products']);
  }
}
