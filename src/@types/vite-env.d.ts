// svg 사용을 위한 vite-plugin-svgr 설치 후 타입 추가

/// <reference types="vite/client" />

declare module "*.svg?react" {
  import type { FunctionComponent, SVGProps } from "react";

  const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
