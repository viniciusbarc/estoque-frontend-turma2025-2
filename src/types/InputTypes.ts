export interface ProductInput {
  uuid: string;
  productOrderId: string;
  quantity: number;
  inputDate: string;
}

export interface CreateProductInputRequest {
  productOrderId: string;
  quantity: number;
  inputDate: string;
}

export interface CreateProductInputResponse {
  productInputId: string;
  productInputQuantity: number;
  productInputDate: string;
  productOrderId: string;
  productOrderDate: string;
  productOrderStatus: string;
  productBarcode: string;
  productName: string;
  productStock: number;
}
