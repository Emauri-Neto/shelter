# Arquitetura

## Visão Lógica

A visão lógica do Shelter ilustra a estrutura organizacional do sistema, detalhando seus módulos e componentes principais, suas responsabilidades e as interações entre eles. Este diagrama e a descrição fornecem uma visão abrangente de como o sistema é logicamente organizado para alcançar seus objetivos funcionais e não funcionais.

## Componentes

### 1. Módulo de Autenticação e Autorização

Gerencia o acesso ao sistema, garantindo que apenas usuários autenticados e autorizados possam acessar funcionalidades específicas.

- **Responsabilidades:**
  - Autenticação de usuários (login/logout).
  - Gerenciamento de permissões e roles.
  - Recuperação de senha.

### 2. Módulo de Registro de Pacientes

Permite que pacientes se registrem no sistema para acessar funcionalidades específicas.

- **Responsabilidades:**
  - Cadastro de novos pacientes.
  - Gerenciamento de perfis de pacientes.
  - Atualização de informações pessoais.

### 3. Módulo de Gestão de Pacientes

Centraliza todas as informações relacionadas aos pacientes, facilitando o acesso e a atualização de dados médicos.

- **Responsabilidades:**
  - Cadastro e gerenciamento de registros de pacientes.
  - Histórico médico.
  - Agendamento de consultas.

### 4. Módulo de Prontuário Eletrônico

Permite o armazenamento e acesso aos registros médicos eletrônicos dos pacientes.

- **Responsabilidades:**
  - Registro de diagnósticos e tratamentos.
  - Atualização de informações clínicas.
  - Visualização de exames e resultados laboratoriais.

### 5. Módulo de Prescrição Eletrônica

Facilita a emissão de receitas médicas e a comunicação com farmácias.

- **Responsabilidades:**
  - Criação e gerenciamento de prescrições.
  - Integração com farmácias para envio de receitas.
  - Histórico de medicamentos prescritos.

### 6. Módulo de Agendamento e Calendário

Gerencia o agendamento de consultas e procedimentos médicos.

- **Responsabilidades:**
  - Agendamento de consultas e exames.
  - Gerenciamento de disponibilidade dos profissionais de saúde.
  - Notificações e lembretes para pacientes e profissionais.

### 7. Módulo de Relatórios e Análises

Gera relatórios e análises para apoiar a tomada de decisões clínicas e administrativas.

- **Responsabilidades:**
  - Criação de relatórios clínicos e administrativos.
  - Análise de dados de saúde.
  - Dashboards personalizados.

## Interações entre os Componentes

> TODO: Criar flow de como os componentes interagem entre si