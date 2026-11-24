import { existsSync } from "node:fs";
import { join } from "node:path";

/** Returns the URL of a supplied 3D model, or undefined to use the built-in one.
    Expected files: public/models/skyline.glb, truck.glb, building.glb */
export function suppliedModel(name: "skyline" | "truck" | "building") {
  return existsSync(join(process.cwd(), "public", "models", `${name}.glb`)) ? `/models/${name}.glb` : undefined;
}
