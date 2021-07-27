import {
  /*Burpee,
  ForwardBendFront,
  ForwardBendSide,
  Plank,
  Pushup,
  SquatHold,
  */

  HeadPitch,
  HeadRoll,
  HeadYaw,
  Squat,

} from "./index";

export const MovementIndex = {

  squat: {
    handler: Squat,
  },
  headRoll: {
    handler: HeadRoll,
  },
  headYaw: {
    handler: HeadYaw,
  },
  headPitch: {
    handler: HeadPitch,
  },

  /*
  burpee: {
    handler: Burpee,
  },
  squatHold: {
    handler: SquatHold,
  },
  pushup: {
    handler: Pushup,
  },
  plank: {
    handler: Plank,
  },

  forwardBendFront: {
    handler: ForwardBendFront,
  },
  forwardBendSide: {
    handler: ForwardBendSide,
  }

   */
}
