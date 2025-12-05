# Requirements Document

## Introduction

PromptBlocks is a Skeleton Crew project that provides a reusable block-based system for AI-powered text transformations. The system consists of a shared skeleton engine and two applications: PromptBlocks Personal (single-block execution) and PromptBlocks Workflow Builder (multi-block sequential execution). All AI-powered transformations use OpenRouter with the free Qwen 2.5 7B model. The system is designed for non-technical users with minimal UI complexity and no authentication requirements.

## Glossary

- **PromptBlocks System**: The complete project including skeleton engine and both applications
- **Skeleton Engine**: The shared foundation code that powers both applications
- **Block**: A single text transformation function that takes input and produces human-readable output via OpenRouter
- **Block Registry**: The centralized collection of all available blocks
- **Block Executor**: The component that runs individual blocks using OpenRouter
- **Workflow Engine**: The component that executes multiple blocks sequentially
- **OpenRouter**: The AI service provider used for all text transformations
- **Qwen 2.5 7B**: The free AI model used for all transformations
- **PromptBlocks Personal**: The single-block execution application
- **PromptBlocks Workflow Builder**: The multi-block sequential execution application
- **Sample Data**: Pre-defined test input provided for each block

## Requirements

### Requirement 1

**User Story:** As a non-technical user, I want to transform text using a single AI-powered block, so that I can quickly process content without complex setup

#### Acceptance Criteria

1. WHEN the user opens PromptBlocks Personal, THE PromptBlocks System SHALL display a list of all available blocks
2. WHEN the user selects a block, THE PromptBlocks System SHALL display a text input area for user content
3. WHEN the user clicks "Try Sample Data", THE PromptBlocks System SHALL populate the input area with pre-defined sample data for the selected block
4. WHEN the user submits input text, THE Block Executor SHALL send the text to OpenRouter using Qwen 2.5 7B model and return human-readable output
5. THE PromptBlocks System SHALL display the transformation result in human-readable format without JSON structure

### Requirement 2

**User Story:** As a user, I want to chain multiple text transformation blocks together, so that I can create complex multi-step text processing workflows

#### Acceptance Criteria

1. WHEN the user opens PromptBlocks Workflow Builder, THE PromptBlocks System SHALL display a block selection interface for creating workflows
2. WHEN the user selects multiple blocks, THE PromptBlocks System SHALL create a sequential workflow using the selected blocks
3. WHEN the user executes a workflow, THE Workflow Engine SHALL run each block sequentially passing output from one block as input to the next
4. WHEN each block completes, THE PromptBlocks System SHALL display the intermediate output in human-readable format
5. THE PromptBlocks System SHALL provide pre-built sample workflows for easy testing

### Requirement 3

**User Story:** As a developer, I want a reusable skeleton engine, so that both applications share the same core functionality without code duplication

#### Acceptance Criteria

1. THE Skeleton Engine SHALL provide a Block Registry that stores all available block definitions
2. THE Skeleton Engine SHALL provide a Block Executor that executes individual blocks using OpenRouter
3. THE Skeleton Engine SHALL provide a Workflow Engine that executes multiple blocks sequentially
4. THE Skeleton Engine SHALL enforce consistent input/output format rules across all blocks
5. WHEN either application needs to execute a block, THE application SHALL use the Skeleton Engine without modification

### Requirement 4

**User Story:** As a user, I want access to common text transformation blocks, so that I can perform typical text processing tasks

#### Acceptance Criteria

1. THE Block Registry SHALL include a Summarize block that condenses text using OpenRouter
2. THE Block Registry SHALL include a Rewrite to Email block that converts text to email format using OpenRouter
3. THE Block Registry SHALL include an Extract Key Points block that identifies main ideas using OpenRouter
4. THE Block Registry SHALL include an Improve Writing block that enhances text quality using OpenRouter
5. THE Block Registry SHALL include a Translate block that converts text between languages using OpenRouter
6. THE Block Registry SHALL include a Convert to Table block that structures text as tabular data using OpenRouter

### Requirement 5

**User Story:** As a user, I want all AI transformations to use a free model, so that I can use the system without incurring costs

#### Acceptance Criteria

1. THE Block Executor SHALL use OpenRouter as the AI service provider for all transformations
2. THE Block Executor SHALL use the Qwen 2.5 7B model for all OpenRouter API calls
3. THE Block Executor SHALL configure OpenRouter to use the free tier
4. WHEN any block executes, THE Block Executor SHALL send requests exclusively to OpenRouter with Qwen 2.5 7B model
5. THE PromptBlocks System SHALL not provide options to change the AI model or provider

### Requirement 6

**User Story:** As a non-technical user, I want a simple interface with no authentication, so that I can start using the system immediately

#### Acceptance Criteria

1. THE PromptBlocks System SHALL not require user login or account creation
2. THE PromptBlocks System SHALL provide a minimal user interface with clear visual hierarchy
3. THE PromptBlocks System SHALL accept only text input for all blocks
4. WHEN the user opens either application, THE PromptBlocks System SHALL be immediately usable without configuration
5. THE PromptBlocks System SHALL provide sample input data for all blocks to enable quick testing

### Requirement 7

**User Story:** As a user, I want to see human-readable results, so that I can understand the output without technical knowledge

#### Acceptance Criteria

1. WHEN any block completes execution, THE PromptBlocks System SHALL display output as plain human-readable text
2. THE PromptBlocks System SHALL not display JSON structures in the user interface
3. THE PromptBlocks System SHALL not display raw API responses in the user interface
4. WHEN a workflow executes, THE PromptBlocks System SHALL display each step output in human-readable format
5. THE PromptBlocks System SHALL format multi-step workflow outputs with clear step labels

### Requirement 8

**User Story:** As a developer, I want automated testing for all blocks, so that I can verify functionality and catch errors early

#### Acceptance Criteria

1. THE PromptBlocks System SHALL include automated tests for each individual block in PromptBlocks Personal
2. THE PromptBlocks System SHALL include automated tests for multi-block workflows in PromptBlocks Workflow Builder
3. WHEN tests detect errors, THE PromptBlocks System SHALL provide clear error messages
4. THE PromptBlocks System SHALL validate that all blocks return human-readable output
5. THE PromptBlocks System SHALL validate that workflow chains pass data correctly between blocks
