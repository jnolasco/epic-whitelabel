export const MovementPhase = {
  PENDING_DEVICE_ORIENTATION: "pending_orientation", // tilt phone up on ground
  PENDING_INBOUNDS: "pending_inbounds", // get the in box
  SELECTING_ORIGIN: "selecting_origin", // maybe you'll sit on these points?
  COUNTDOWN: "countdown", // sitting on points
  ACTIVE: "active", // actually inside exercise
  PAUSED: "paused",
  ABORTED: "aborted",
  COMPLETE: "complete",
  ERROR: "error"
};
