import { claimEnd, getClaimedEnd } from "../../../InputManager.js";
import { archetypes } from "../../../index.js";
import { FlatNote } from "../FlatNote.js";

export abstract class SlideEndNote extends FlatNote {
  leniency = 1;

  slideEndData = this.defineImport({
    slideRef: { name: "slide", type: Number },
  });

  updateSequential() {
    if (time.now < this.inputTime.min) return;

    // if (this.startInfo.state !== EntityState.Despawned) return

    claimEnd(
      this.info.index,
      this.targetTime,
      this.hitbox,
      this.fullHitbox,
      Math.abs(this.startSharedMemory.lastActiveTime - time.now) <= time.delta
        ? this.targetTime
        : 99999,
    );
  }

  touch() {
    if (time.now < this.inputTime.min) return;

    // if (this.startInfo.state !== EntityState.Despawned) return

    const index = getClaimedEnd(this.info.index);
    if (index === -1) return;

    this.complete(touches.get(index));
  }

  get slideData() {
    return archetypes.NormalSlideConnector.data.get(this.slideEndData.slideRef);
  }

  get startInfo() {
    return entityInfos.get(this.slideData.startRef);
  }

  get startSharedMemory() {
    return archetypes.NormalSlideStartNote.sharedMemory.get(
      this.slideData.startRef,
    );
  }

  complete(touch: Touch) {
    this.result.judgment = input.judge(
      touch.time,
      this.targetTime,
      this.windows,
    );
    this.result.accuracy = touch.time - this.targetTime;

    this.result.bucket.index = this.bucket.index;
    this.result.bucket.value = this.result.accuracy * 1000;

    this.playHitEffects(touch.time);

    this.despawn = true;
  }
}
