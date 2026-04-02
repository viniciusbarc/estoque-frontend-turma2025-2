import { test, expect } from '@playwright/test';

test('Deve criar uma entrada de produto passando pelas 3 páginas e verificar estoque atualizado', async ({ page }) => {

  const barcode: number = Date.now();
  const productName = 'Guaraná' + barcode.toString();

  // 1) Criar o Produto
  await page.goto('/');
  await page.getByRole('link', { name: 'Produtos', exact: true }).click();
  await page.getByRole('link', { name: 'Novo Produto' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'Código de Barras' }).fill(barcode.toString());
  await page.getByRole('textbox', { name: 'Nome' }).fill(productName);
  await page.getByRole('spinbutton', { name: 'Dias de Referência' }).fill('30');
  await page.getByRole('button', { name: 'Criar Produto' }).click();
  await page.waitForTimeout(2000);
  await expect(page.getByText('Produto criado com sucesso!')).toBeVisible();
  await expect(page.getByTestId('product-quantity')).toHaveText('0');

  // 2) Criar o Pedido
  await page.getByRole('link', { name: 'Pedidos', exact: true }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('link', { name: 'Novo Pedido' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('textbox', { name: 'Código de Barras do Produto' }).fill(barcode.toString());
  await page.getByRole('spinbutton', { name: 'Quantidade' }).fill('10');
  await page.locator('#orderDate').fill('2025-07-10T10:00');
  await page.getByRole('button', { name: 'Criar Pedido' }).click();
  await page.waitForTimeout(2000);

  // Capturar o UUID do pedido na página de detalhes
  const orderUuid = await page.locator('.detail-item strong').first().innerText();

  // 3) Criar a Entrada
  await page.getByRole('link', { name: 'Entradas', exact: true }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('link', { name: 'Nova Entrada' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('textbox', { name: 'UUID do Pedido' }).fill(orderUuid);
  await page.getByRole('spinbutton', { name: 'Quantidade' }).fill('10');
  await page.locator('#inputDate').fill('2025-07-15T10:00');
  await page.getByRole('button', { name: 'Criar Entrada' }).click();
  await page.waitForTimeout(2000);

  // Verificar que a entrada foi criada com sucesso
  await expect(page.getByText('Entrada criada com sucesso!')).toBeVisible();
  await expect(page.getByTestId('input-quantity')).toHaveText('10');

  // 4) Verificar que o estoque do produto foi atualizado
  await page.getByRole('link', { name: 'Produtos', exact: true }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('link', { name: 'Detalhes' }).filter({ has: page.locator(`xpath=ancestor::tr[contains(., "${barcode}")]`) }).first().click();
  await page.waitForTimeout(2000);

  // O estoque deve ser 10 agora (era 0, entrada de 10)
  await expect(page.getByTestId('product-quantity')).toHaveText('10');

  // 5) Verificar que a entrada aparece na lista de entradas
  await page.getByRole('link', { name: 'Entradas', exact: true }).click();
  await page.waitForTimeout(2000);
  await expect(page.getByText(orderUuid).first()).toBeVisible();
});

test('Deve retornar erro ao criar entrada com pedido inexistente', async ({ page }) => {

  // Tentar criar entrada com pedido que não existe
  await page.goto('/');
  await page.getByRole('link', { name: 'Entradas', exact: true }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('link', { name: 'Nova Entrada' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('textbox', { name: 'UUID do Pedido' }).fill('uuid-inexistente-123');
  await page.getByRole('spinbutton', { name: 'Quantidade' }).fill('10');
  await page.locator('#inputDate').fill('2025-07-15T10:00');
  await page.getByRole('button', { name: 'Criar Entrada' }).click();
  await page.waitForTimeout(2000);

  // Deve continuar na página de criação e mostrar erro
  await expect(page).toHaveURL('/inputs/new');
  await expect(page.locator('.toast.toast-error')).toBeVisible();
});
