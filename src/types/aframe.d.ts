import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-entity': any;
      'a-assets': any;
      'a-camera': any;
      'a-video': any;
      'a-plane': any;
      'a-box': any;
      'a-sphere': any;
      'a-cylinder': any;
      'a-sky': any;
      'a-light': any;
      'a-text': any;
      'a-image': any;
      'a-cursor': any;
      'a-ring': any;
    }
  }
}
