import { Given, When, Then } from '@cucumber/cucumber'
import { CustomWorld } from '../support/world.ts'
import { expect } from '@playwright/test';

Given('que estou na tela de nova entrada', async function (this: CustomWorld) {
  await this.page!.goto('/');
  await this.page!.getByRole('link', { name: 'Entradas', exact: true }).click();
  await this.page!.waitForTimeout(1000);
  await this.page!.getByRole('link', { name: 'Nova Entrada' }).click();
  await this.page!.waitForTimeout(1000);
})

When('preencho os dados da entrada com um pedido inexistente', async function (this: CustomWorld) {
  await this.page!.getByRole('textbox', { name: 'UUID do Pedido' }).fill('uuid-inexistente-123');
  await this.page!.getByRole('spinbutton', { name: 'Quantidade' }).fill('10');
  await this.page!.locator('#inputDate').fill('2025-07-15T10:00');
})

When('solicito a criação da entrada com erro', async function (this: CustomWorld) {
  await this.page!.getByRole('button', { name: 'Criar Entrada' }).click();
  await this.page!.waitForTimeout(2000);
})

Then('devo ver uma mensagem de erro na entrada', async function (this: CustomWorld) {
  await expect(this.page!).toHaveURL('/inputs/new');
  await expect(this.page!.locator('.toast.toast-error')).toBeVisible();
})
