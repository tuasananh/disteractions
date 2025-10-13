# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

-   Documentation improvements
-   More comprehensive examples
-   Additional utility functions
-   Performance optimizations

## [0.7.1] - 2025-10-13

### Refactor

-   Reorganise imports and exports

## [0.7.0] - 2025-10-09

### Added

-   Add custom error handling with DisteractionError and error codes
-   Add support for more interactions
    -   Introduced `MentionableSelectMenuInteraction` class to handle mentionable select menu interactions.
    -   Updated `MessageComponentInteraction` to support new interaction types.
    -   Added `RoleSelectMenuInteraction` and `UserSelectMenuInteraction` classes for role and user select menus respectively.
    -   Created `StringSelectMenuInteraction` class for string select menu interactions.
    -   Implemented `MessageContextMenuCommandInteraction` and `UserContextMenuCommandInteraction` for context menu commands.
    -   Added `PrimaryEntryPointCommandInteraction` for primary entry point commands.
    -   Refactored `ModalSubmitInteraction` to improve structure and error handling.
    -   Introduced `RepliableInteraction` class to handle interaction responses more effectively.
    -   Updated button runner to support new interaction types and improved callback handling.
    -   Removed deprecated chat input application command runner and replaced it with a more robust chat input command runner.
    -   Enhanced argument handling for chat input commands with comprehensive type safety.
    -   Updated modal runner to streamline modal submission handling and response types.

### Refactor

-   Rework handlers to fit with the new interactions

[0.7.0]: https://github.com/tuasananh/disteractions/releases/tag/v0.7.0

## [0.6.0] - 2025-10-07

### Added

-   AI-generated documentation

[0.6.0]: https://github.com/tuasananh/disteractions/releases/tag/v0.6.0

## [0.5.1] - 2025-10-07

### Fixed

-   Made prefilled data for modals optional

[0.5.1]: https://github.com/tuasananh/disteractions/releases/tag/v0.5.1

## [0.5.0] - 2025-10-07

### Added

-   Added more methods for interaction responses

[0.5.0]: https://github.com/tuasananh/disteractions/releases/tag/v0.5.0

## [0.4.0] - 2025-10-07

### Added

-   Update modal callback to include data parameter for enhanced interaction handling

[0.4.0]: https://github.com/tuasananh/disteractions/releases/tag/v0.4.0
