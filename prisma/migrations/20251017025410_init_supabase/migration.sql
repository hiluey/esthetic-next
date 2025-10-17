-- CreateEnum
CREATE TYPE "StatusMembro" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "mensagens_marketing_tipo" AS ENUM ('aniversario', 'followup', 'promocao', 'outro');

-- CreateEnum
CREATE TYPE "pagamentos_metodo_pagamento" AS ENUM ('pix', 'cartao', 'dinheiro', 'boleto', 'outro');

-- CreateEnum
CREATE TYPE "metas_financeiras_periodo" AS ENUM ('mensal', 'semanal', 'anual');

-- CreateEnum
CREATE TYPE "usuarios_tipo" AS ENUM ('esteticista', 'colaborador', 'admin');

-- CreateEnum
CREATE TYPE "pagamentos_status" AS ENUM ('pendente', 'confirmado', 'cancelado');

-- CreateEnum
CREATE TYPE "mensagens_marketing_status" AS ENUM ('pendente', 'enviado', 'falha');

-- CreateEnum
CREATE TYPE "agendamentos_status" AS ENUM ('agendado', 'realizado', 'cancelado');

-- CreateTable
CREATE TABLE "agendamentos" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "cliente_id" INTEGER,
    "servico_id" INTEGER,
    "colaborador_id" INTEGER,
    "procedimento" TEXT,
    "valor" DECIMAL(65,30),
    "hora_marcada" TEXT,
    "data_hora" TIMESTAMP(3),
    "status" "agendamentos_status" DEFAULT 'agendado',
    "pago" BOOLEAN DEFAULT false,
    "criado_em" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agendamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "nome" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "data_nascimento" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensagens_marketing" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "tipo" "mensagens_marketing_tipo",
    "texto" TEXT,
    "data_envio" TIMESTAMP(3),
    "status" "mensagens_marketing_status" DEFAULT 'pendente',
    "criado_em" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensagens_marketing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metas_financeiras" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "descricao" TEXT,
    "valor_meta" DECIMAL(65,30),
    "periodo" "metas_financeiras_periodo",
    "atingida" BOOLEAN DEFAULT false,
    "criado_em" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metas_financeiras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentos" (
    "id" SERIAL NOT NULL,
    "agendamento_id" INTEGER,
    "valor" DECIMAL(65,30),
    "metodo_pagamento" "pagamentos_metodo_pagamento",
    "data_pagamento" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "status" "pagamentos_status" DEFAULT 'pendente',

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "nome" TEXT,
    "estoque" INTEGER,
    "validade" TIMESTAMP(3),
    "custo" DECIMAL(65,30),
    "preco_venda" DECIMAL(65,30),
    "criado_em" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatorios" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "tipo_relatorio" TEXT,
    "dados" JSONB,
    "criado_em" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relatorios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicos" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "nome" TEXT,
    "descricao" TEXT,
    "preco" DECIMAL(65,30),
    "duracao_minutos" INTEGER,
    "criado_em" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT,
    "nome_negocio" TEXT,
    "faturamento_mensal" DECIMAL(65,30),
    "principais_metas" TEXT,
    "cor_app" TEXT,
    "email" TEXT,
    "senha_hash" TEXT,
    "tipo" "usuarios_tipo" DEFAULT 'esteticista',
    "criado_em" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipe" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "funcao" TEXT NOT NULL,
    "status" "StatusMembro" NOT NULL DEFAULT 'active',
    "ultima_atividade" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "criado_em" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "equipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "agendamentos_cliente_id_idx" ON "agendamentos"("cliente_id");

-- CreateIndex
CREATE INDEX "agendamentos_colaborador_id_idx" ON "agendamentos"("colaborador_id");

-- CreateIndex
CREATE INDEX "agendamentos_servico_id_idx" ON "agendamentos"("servico_id");

-- CreateIndex
CREATE INDEX "agendamentos_usuario_id_idx" ON "agendamentos"("usuario_id");

-- CreateIndex
CREATE INDEX "clientes_usuario_id_idx" ON "clientes"("usuario_id");

-- CreateIndex
CREATE INDEX "mensagens_marketing_usuario_id_idx" ON "mensagens_marketing"("usuario_id");

-- CreateIndex
CREATE INDEX "metas_financeiras_usuario_id_idx" ON "metas_financeiras"("usuario_id");

-- CreateIndex
CREATE INDEX "pagamentos_agendamento_id_idx" ON "pagamentos"("agendamento_id");

-- CreateIndex
CREATE INDEX "produtos_usuario_id_idx" ON "produtos"("usuario_id");

-- CreateIndex
CREATE INDEX "relatorios_usuario_id_idx" ON "relatorios"("usuario_id");

-- CreateIndex
CREATE INDEX "servicos_usuario_id_idx" ON "servicos"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "equipe_email_key" ON "equipe"("email");

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_servico_id_fkey" FOREIGN KEY ("servico_id") REFERENCES "servicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_colaborador_id_fkey" FOREIGN KEY ("colaborador_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_usuario_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagens_marketing" ADD CONSTRAINT "mensagens_marketing_usuario_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metas_financeiras" ADD CONSTRAINT "metas_financeiras_usuario_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_agendamento_id_fk" FOREIGN KEY ("agendamento_id") REFERENCES "agendamentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_usuario_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorios" ADD CONSTRAINT "relatorios_usuario_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_usuario_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
