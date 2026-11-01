import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Software WebGL so 3D (Three.js) renders on GitHub's machines, which have no GPU.
Config.setChromiumOpenGlRenderer("swangle");
