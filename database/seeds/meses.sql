-- Seed para criar meses iniciais
INSERT INTO meses (ano, mes, nome, nome_exibicao, ativo, created_at)
VALUES
  (2025, 11, 'novembro_2025', 'Novembro 2025', true, NOW()),
  (2025, 12, 'dezembro_2025', 'Dezembro 2025', true, NOW())
ON DUPLICATE KEY UPDATE nome_exibicao = VALUES(nome_exibicao);

