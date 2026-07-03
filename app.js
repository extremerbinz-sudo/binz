const frames = [
  ["夜雨抵达", "景德镇老街被雨水擦亮。白瓷摊位没有摊主，只有远处的窑火在等人。"],
  ["无脸人偶", "未上釉的白瓷人偶挤满街边。它们没有五官，却都朝着同一个方向。"],
  ["镜中裂纹", "民宿镜面出现细密开片。现实里的镜子没碎，镜中的人却慢了半拍。"],
  ["门铃亮起", "废弃窑厂突然复燃。巨大窑门旁，一枚老式门铃发出幽绿的光。"],
  ["集体赴窑", "年轻人从不同巷口走出。他们带着行李、相机和没喝完的陶瓷杯。"],
  ["不存在的家", "窑门里没有火。旧木桌上有热饭，泛黄电视里播放着不存在的童年。"],
  ["第一次烧制", "哭泣的人走进窑门。红光从两侧合拢，最后吞掉他伸出的手。"],
  ["完整的人", "他重新走出来，干净、安静、温柔。脖子后面多了一道瓷器裂纹。"],
  ["碗中倒影", "白瓷碗盛着一层雨水。水面里，是她早已拆掉的旧家。"],
  ["全城排队", "越来越多人等待被修复。出来的人都在笑，皮肤却像青白瓷一样开片。"],
  ["瓷壳之下", "人偶摔碎，碎片里面露出熟悉的脸。原来替换早已开始。"],
  ["另一个她", "窑门深处，另一个完整的她坐在饭桌旁。现实中的手背出现第一道裂纹。"],
];

const frameGrid = document.querySelector("#frameGrid");
const dialog = document.querySelector("#frameDialog");
const dialogImage = document.querySelector("#dialogImage");
const dialogIndex = document.querySelector("#dialogIndex");
const dialogTitle = document.querySelector("#dialogTitle");
const dialogDescription = document.querySelector("#dialogDescription");
let activeFrame = 0;

const framePath = (index) => `assets/frame-${String(index + 1).padStart(2, "0")}.jpg`;

frames.forEach(([title, description], index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "frame-card reveal";
  button.setAttribute("aria-label", `查看第${index + 1}幕：${title}`);
  button.innerHTML = `
    <figure>
      <div class="frame-card-image">
        <img src="${framePath(index)}" alt="${title}" loading="lazy" />
        <span class="frame-card-number">${String(index + 1).padStart(2, "0")}</span>
      </div>
      <figcaption>
        <strong>${title}</strong>
        <p>${description}</p>
      </figcaption>
    </figure>
  `;
  button.addEventListener("click", () => openFrame(index));
  frameGrid.appendChild(button);
});

function openFrame(index) {
  activeFrame = (index + frames.length) % frames.length;
  const [title, description] = frames[activeFrame];
  dialogImage.src = framePath(activeFrame);
  dialogImage.alt = title;
  dialogIndex.textContent = `${String(activeFrame + 1).padStart(2, "0")} / 12`;
  dialogTitle.textContent = title;
  dialogDescription.textContent = description;
  if (!dialog.open) dialog.showModal();
}

document.querySelector("#dialogClose").addEventListener("click", () => dialog.close());
document.querySelector("#dialogPrev").addEventListener("click", () => openFrame(activeFrame - 1));
document.querySelector("#dialogNext").addEventListener("click", () => openFrame(activeFrame + 1));
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

document.addEventListener("keydown", (event) => {
  if (!dialog.open) return;
  if (event.key === "ArrowLeft") openFrame(activeFrame - 1);
  if (event.key === "ArrowRight") openFrame(activeFrame + 1);
});

const video = document.querySelector("#heroVideo");
const playToggle = document.querySelector("#playToggle");
const soundToggle = document.querySelector("#soundToggle");
const videoTime = document.querySelector("#videoTime");
const filmProgress = document.querySelector("#filmProgress");

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
};

playToggle.addEventListener("click", async () => {
  if (video.paused) {
    await video.play();
    playToggle.textContent = "暂停";
  } else {
    video.pause();
    playToggle.textContent = "播放";
  }
});

soundToggle.addEventListener("click", () => {
  video.muted = !video.muted;
  soundToggle.textContent = video.muted ? "开启声音" : "静音";
});

video.addEventListener("timeupdate", () => {
  const progress = video.duration ? (video.currentTime / video.duration) * 100 : 0;
  filmProgress.style.width = `${progress}%`;
  videoTime.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration || 45)}`;
});

const kilnRange = document.querySelector("#kilnRange");
const kilnValue = document.querySelector("#kilnValue");
const experimentAfter = document.querySelector("#experimentAfter");
const experimentBefore = document.querySelector("#experimentBefore");
const experimentMessage = document.querySelector("#experimentMessage");
const experimentStamp = document.querySelector("#experimentStamp");
const crackLines = document.querySelector(".crack-lines");

const kilnStates = [
  [20, "尚未入窑。你还保留着所有不完整。", "原始状态"],
  [45, "窑火开始辨认你的旧伤。", "预热中"],
  [70, "裂纹正在被重新排列。", "烧制中"],
  [90, "新的你已经在窑门后睁开眼睛。", "身份重塑"],
  [101, "替换完成。请不要寻找原来的自己。", "烧制完成"],
];

kilnRange.addEventListener("input", () => {
  const value = Number(kilnRange.value);
  kilnValue.textContent = `${value}%`;
  experimentAfter.style.opacity = value / 100;
  experimentBefore.style.filter = `grayscale(${value / 160}) contrast(${1 + value / 350})`;
  experimentBefore.style.transform = `scale(${1 + value / 1200})`;
  crackLines.style.opacity = Math.max(0, (value - 35) / 65);
  const state = kilnStates.find((item) => value < item[0]) || kilnStates[kilnStates.length - 1];
  experimentMessage.textContent = state[1];
  experimentStamp.textContent = state[2];
});

let audioContext;
let ringCount = 2;
const doorbellButton = document.querySelector("#doorbellButton");
const doorbellMessage = document.querySelector("#doorbellMessage");
const doorbellTitle = document.querySelector("#doorbellTitle");
const ringCountLabel = document.querySelector("#ringCount");

function tone(frequency, start, duration) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.22, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(start);
  oscillator.stop(start + duration);
}

doorbellButton.addEventListener("click", () => {
  audioContext ||= new AudioContext();
  const now = audioContext.currentTime;
  tone(659, now, 0.45);
  tone(523, now + 0.48, 0.55);
  ringCount += 1;
  document.body.classList.add("ringing");
  setTimeout(() => document.body.classList.remove("ringing"), 700);

  if (ringCount === 3) {
    doorbellTitle.textContent = "第三声已经确认。";
    doorbellMessage.textContent = "全城回窑开始。";
    ringCountLabel.textContent = "响铃次数 03 / 03";
  } else if (ringCount >= 4) {
    document.body.classList.add("replaced");
    doorbellTitle.textContent = "替换完成。";
    doorbellMessage.textContent = "现在坐在屏幕前的，还是原来的你吗？";
    ringCountLabel.textContent = "身份状态：已烧制";
    doorbellButton.disabled = true;
    doorbellButton.lastChild.textContent = " 已完成";
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const siteHeader = document.querySelector("#siteHeader");
const readingProgress = document.querySelector("#readingProgress");
window.addEventListener(
  "scroll",
  () => {
    siteHeader.classList.toggle("scrolled", window.scrollY > 40);
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
    readingProgress.style.width = `${progress}%`;
  },
  { passive: true },
);
