import { ProductDetail } from "@/components/ProductDetail";
import { productDetails } from "@/lib/store-catalog";

export default function SampleProductPage() {
  return <ProductDetail product={productDetails["poussette-compacte"]} />;
}
