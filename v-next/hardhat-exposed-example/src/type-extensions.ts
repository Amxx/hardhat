/**
 * Type extensions for the hardhat-exposed-example plugin.
 *
 * This module extends Hardhat's configuration types using TypeScript's
 * declaration merging. The pattern uses two interfaces:
 *
 * - `ProjectPathsUserConfig`: User-facing config where fields are optional
 * - `ProjectPathsConfig`: Resolved config where fields are required
 *
 * This ensures type safety: users can omit the field (defaults apply),
 * but after resolution the field is guaranteed to exist.
 */
import "hardhat/types/config";
import { ExposedUserConfig, ExposedConfig } from "./internal/types.js";

declare module "hardhat/types/config" {
  export interface HardhatUserConfig {
    exposed?: ExposedUserConfig;
  }

  export interface HardhatConfig {
    exposed: ExposedConfig;
  }
}
