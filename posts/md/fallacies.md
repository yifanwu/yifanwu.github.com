# Fallacies

I'm TA DS100 spring 2020 and I'm writing up some notes with visualizations as part of the material.

## Prosecutor's Fallacy

_Based on DS100 Discussion prompt, and I have re-ordered the statements slightly._

Investigators are at the scene of a crime.  Some research have narrowed down the suspects to 10,000 people who could all have committed the crime based on the town size---each represented by a dot:
<svg height="20" width="20" style="display: float">
  <circle id="crimeCircle" cx="10" cy="10" r="10" fill="rgb(76, 120, 168)" />
</svg>.

Well this is not a lot of information to base your decision off on. With further investigation, someone reported that the footprint that shows a distinctive pattern on the sole. With some research, one finds that out of the 10,000 people, 10 have this kind of shoe. Now click "shoe info" to get a visual of the new information.

<div id="chart"></div>
<div style="padding-bottom: 40px">
  <button id="noInfoBtn" style="display: float">no shoe info</button>
  <button id="infoBtn" style="display: float">shoe info</button>
</div>

**The question now is, how confident are you to put the suspect to jail?**
