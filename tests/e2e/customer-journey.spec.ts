import { test, expect } from "@playwright/test";

test("Customer browse to product details journey", async ({ page }) => {
  let cart: {
    items: Array<{ id: string; title: string; variantName: string; quantity: number; unitPrice: number; lineTotal: number; image: null }>;
    subtotal: number;
    shippingCost: number;
    total: number;
  } = { items: [], subtotal: 0, shippingCost: 0, total: 0 };
  await page.route("**/api/cart", async (route) => {
    if (route.request().method() === "POST") {
      const { quantity } = route.request().postDataJSON() as { variantSku: string; quantity: number };
      const lineTotal = 1890 * quantity;
      cart = {
        items: [{ id: "test-item", title: "Poussette Compacte Tout-Terrain Luxe", variantName: "Gris Anthracite", quantity, unitPrice: 1890, lineTotal, image: null }],
        subtotal: lineTotal,
        shippingCost: 0,
        total: lineTotal,
      };
    }

    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(cart) });
  });

  // 1. Visit homepage
  await page.goto("/");
  await expect(page).toHaveTitle(/Kids/i);

  // 2. Navigate to catalog/shop or category
  await page.goto("/shop");
  await expect(page.locator("text=Recherche & Catalogue")).toBeVisible();

  // 3. Click on a product to view details
  await page.getByRole("link", { name: /Poussette Compacte Tout-Terrain Luxe/ }).click();
  await expect(page.locator("text=Poussette Compacte Tout-Terrain Luxe")).toBeVisible();

  // 4. Test quantity increment and add to cart elements
  await page.getByRole("button", { name: "Augmenter la quantité" }).click();
  await page.getByRole("button", { name: /Ajouter au panier/ }).click();
  await expect(page.getByRole("button", { name: "Ajouté au panier" })).toBeVisible();

  // 5. Verify the cart shows the selected quantity and total.
  await page.getByRole("link", { name: /Panier/ }).click();
  await expect(page.getByRole("heading", { name: "Votre panier" })).toBeVisible();
  await expect(page.getByText("2", { exact: true })).toBeVisible();
  await expect(page.getByText("3,780 MAD", { exact: true })).toBeVisible();

  // 6. Verify checkout is reachable from the cart.
  await expect(page.getByRole("link", { name: "Passer la commande" })).toBeVisible();
});
