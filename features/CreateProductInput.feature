Feature: Criação de entrada de produto

Scenario: Entrada criada com sucesso
  Given que criei um produto e um pedido para entrada
  When navego para a tela de nova entrada
  And preencho os dados da entrada com o pedido criado
  And solicito a criação da entrada
  Then devo ver os detalhes da entrada criada
  And o estoque do produto deve estar atualizado

Scenario: Erro ao criar entrada com pedido inexistente
  Given que estou na tela de nova entrada
  When preencho os dados da entrada com um pedido inexistente
  And solicito a criação da entrada com erro
  Then devo ver uma mensagem de erro na entrada
