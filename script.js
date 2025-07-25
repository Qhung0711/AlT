const correctPIN = "0711";
const imagesPerPage = 20; // Số ảnh mỗi trang
let currentPage = 1;
let currentImageList = [];
let isLoading = false; // Tránh spam click

// Slideshow variables
let slideshowInterval = null;
let slideshowSpeed = 5000; // 5 seconds
let currentSlideshowIndex = 0;
let slideshowImages = [];
let isSlideshowPlaying = false;

// Favorites management
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
let viewHistory = JSON.parse(localStorage.getItem('viewHistory') || '[]');

// Theme management
let currentTheme = localStorage.getItem('theme') || 'light-mode';

// Function to toggle theme
function toggleTheme() {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  const themeText = themeToggle.querySelector('.theme-text');
  
  if (currentTheme === 'light-mode') {
    currentTheme = 'dark-mode';
    body.className = 'dark-mode';
    themeIcon.textContent = '☀️';
    themeText.textContent = 'Light Mode';
  } else {
    currentTheme = 'light-mode';
    body.className = 'light-mode';
    themeIcon.textContent = '🌙';
    themeText.textContent = 'Dark Mode';
  }
  
  localStorage.setItem('theme', currentTheme);
}

// Function to apply saved theme
function applyTheme() {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  
  if (themeToggle) {
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const themeText = themeToggle.querySelector('.theme-text');
    
    body.className = currentTheme;
    
    if (currentTheme === 'dark-mode') {
      themeIcon.textContent = '☀️';
      themeText.textContent = 'Light Mode';
    } else {
      themeIcon.textContent = '🌙';
      themeText.textContent = 'Dark Mode';
    }
  }
}

// Favorite functions
function toggleFavorite(imageName) {
  const index = favorites.indexOf(imageName);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(imageName);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavoriteButtons();
}

function isFavorite(imageName) {
  return favorites.includes(imageName);
}

function updateFavoriteButtons() {
  const favoriteButtons = document.querySelectorAll('.favorite-btn');
  favoriteButtons.forEach(btn => {
    const imageName = btn.getAttribute('data-image');
    if (isFavorite(imageName)) {
      btn.classList.add('favorited');
      btn.innerHTML = '❤️';
    } else {
      btn.classList.remove('favorited');
      btn.innerHTML = '🤍';
    }
  });
}

// View history functions
function addToHistory(imageName) {
  const index = viewHistory.indexOf(imageName);
  if (index > -1) {
    viewHistory.splice(index, 1);
  }
  viewHistory.unshift(imageName);
  if (viewHistory.length > 50) {
    viewHistory = viewHistory.slice(0, 50);
  }
  localStorage.setItem('viewHistory', JSON.stringify(viewHistory));
}

// Slideshow functions
function startSlideshow(imageList) {
  // Đảo ngẫu nhiên danh sách ảnh
  slideshowImages = imageList.slice().sort(() => 0.5 - Math.random());
  currentSlideshowIndex = 0;
  isSlideshowPlaying = true;
  
  const slideshowContainer = document.getElementById('slideshowContainer');
  const slideshowImage = document.getElementById('slideshowImage');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const slideshowInfo = document.getElementById('slideshowInfo');
  
  slideshowContainer.style.display = 'flex';
  showSlideshowImage();
  
  slideshowInterval = setInterval(() => {
    if (isSlideshowPlaying) {
      nextSlideshowImage();
    }
  }, slideshowSpeed);
  
  playPauseBtn.innerHTML = '⏸';
  slideshowInfo.textContent = `${currentSlideshowIndex + 1} / ${slideshowImages.length}`;
}

function stopSlideshow() {
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
  }
  isSlideshowPlaying = false;
  document.getElementById('slideshowContainer').style.display = 'none';
}

function showSlideshowImage() {
  if (slideshowImages.length === 0) return;
  
  const slideshowImage = document.getElementById('slideshowImage');
  const slideshowInfo = document.getElementById('slideshowInfo');
  
  slideshowImage.innerHTML = `<img src="images/${slideshowImages[currentSlideshowIndex]}" alt="${slideshowImages[currentSlideshowIndex]}">`;
  slideshowInfo.textContent = `${currentSlideshowIndex + 1} / ${slideshowImages.length}`;
  
  addToHistory(slideshowImages[currentSlideshowIndex]);
}

function nextSlideshowImage() {
  currentSlideshowIndex = (currentSlideshowIndex + 1) % slideshowImages.length;
  showSlideshowImage();
}

function prevSlideshowImage() {
  currentSlideshowIndex = currentSlideshowIndex === 0 ? slideshowImages.length - 1 : currentSlideshowIndex - 1;
  showSlideshowImage();
}

function toggleSlideshowPlayPause() {
  isSlideshowPlaying = !isSlideshowPlaying;
  const playPauseBtn = document.getElementById('playPauseBtn');
  playPauseBtn.innerHTML = isSlideshowPlaying ? '⏸' : '▶️';
}

// Stats functions
function showStats() {
  const statsModal = document.getElementById('statsModal');
  const statsInfo = document.getElementById('statsInfo');
  
  const totalImages = imageNames.length;
  const favoriteCount = favorites.length;
  const recentViews = viewHistory.slice(0, 10);
  
  let statsHTML = `
    <div style="margin-bottom: 25px;">
      <h3>📊 Tổng quan</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 15px; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 5px;">📸</div>
          <div style="font-size: 1.5rem; font-weight: 700;">${totalImages}</div>
          <div style="font-size: 0.9rem; opacity: 0.9;">Tổng số ảnh</div>
        </div>
        <div style="background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; padding: 20px; border-radius: 15px; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 5px;">❤️</div>
          <div style="font-size: 1.5rem; font-weight: 700;">${favoriteCount}</div>
          <div style="font-size: 0.9rem; opacity: 0.9;">Ảnh yêu thích</div>
        </div>
        <div style="background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; padding: 20px; border-radius: 15px; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 5px;">📈</div>
          <div style="font-size: 1.5rem; font-weight: 700;">${((favoriteCount / totalImages) * 100).toFixed(1)}%</div>
          <div style="font-size: 0.9rem; opacity: 0.9;">Tỷ lệ yêu thích</div>
        </div>
      </div>
    </div>
  `;
  
  if (recentViews.length > 0) {
    statsHTML += `
      <div style="margin-bottom: 25px;">
        <h3>👁️ Ảnh xem gần đây</h3>
        <div style="max-height: 200px; overflow-y: auto; margin-top: 15px;">
    `;
    recentViews.forEach((image, index) => {
      const isFav = isFavorite(image) ? '❤️' : '🤍';
      statsHTML += `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 15px; margin: 5px 0; background: rgba(102, 126, 234, 0.1); border-radius: 10px; border-left: 4px solid #667eea;">
          <span style="font-weight: 500;">${index + 1}. ${image}</span>
          <span style="font-size: 1.2rem; cursor: pointer;" onclick="toggleFavorite('${image}')">${isFav}</span>
        </div>
      `;
    });
    statsHTML += `</div></div>`;
  }
  
  if (favorites.length > 0) {
    statsHTML += `
      <div>
        <h3>❤️ Ảnh yêu thích</h3>
        <div style="max-height: 200px; overflow-y: auto; margin-top: 15px;">
    `;
    favorites.slice(0, 10).forEach((image, index) => {
      statsHTML += `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 15px; margin: 5px 0; background: rgba(255, 107, 107, 0.1); border-radius: 10px; border-left: 4px solid #ff6b6b;">
          <span style="font-weight: 500;">${index + 1}. ${image}</span>
          <span style="font-size: 1.2rem;">❤️</span>
        </div>
      `;
    });
    if (favorites.length > 10) {
      statsHTML += `
        <div style="text-align: center; padding: 10px; color: #666; font-style: italic;">
          ... và ${favorites.length - 10} ảnh khác
        </div>
      `;
    }
    statsHTML += `</div></div>`;
  }
  
  statsInfo.innerHTML = statsHTML;
  statsModal.style.display = 'flex';
}

// Xóa trạng thái đăng nhập mỗi lần tải lại trang (chỉ khi refresh hoặc đóng tab)
window.addEventListener("DOMContentLoaded", function() {
  sessionStorage.removeItem("isLoggedIn");
});

// Kiểm tra trạng thái đăng nhập khi load trang
document.addEventListener("DOMContentLoaded", function() {
  // Apply saved theme
  applyTheme();
  
  // Add theme toggle event listener
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  // Lấy tham số img nếu có
  const urlParams = new URLSearchParams(window.location.search);
  const imgParam = urlParams.get('img');
  if (isLoggedIn === "true") {
    document.getElementById("login").style.display = "none";
    document.getElementById("navigation").style.display = "flex";
    document.getElementById("gallery").style.display = "none";
    // Nếu có img param, chuyển sang view.html?img=...
    if (imgParam) {
      window.location.href = `view.html?img=${encodeURIComponent(imgParam)}`;
    }
  }
  
  const showAllBtn = document.getElementById("showAllBtn");
  const showRandomBtn = document.getElementById("showRandomBtn");
  const showFavoritesBtn = document.getElementById("showFavoritesBtn");
  const slideshowBtn = document.getElementById("slideshowBtn");
  const statsBtn = document.getElementById("statsBtn");
  const gallery = document.getElementById("gallery");
  
  if (showAllBtn) {
    showAllBtn.onclick = function() {
      currentImageList = imageNames;
      currentPage = 1;
      loadImagesWithPagination(currentImageList);
      gallery.style.display = "flex";
    };
  }
  
  if (showRandomBtn) {
    showRandomBtn.onclick = function() {
      // Lấy 5 ảnh ngẫu nhiên
      const shuffled = imageNames.slice().sort(() => 0.5 - Math.random());
      const random5 = shuffled.slice(0, 5);
      currentImageList = random5;
      currentPage = 1;
      loadImagesWithPagination(currentImageList);
      gallery.style.display = "flex";
    };
  }
  
  if (showFavoritesBtn) {
    showFavoritesBtn.onclick = function() {
      if (favorites.length === 0) {
        alert('Bạn chưa có ảnh yêu thích nào!');
        return;
      }
      currentImageList = favorites;
      currentPage = 1;
      loadImagesWithPagination(currentImageList);
      gallery.style.display = "flex";
    };
  }
  
  if (slideshowBtn) {
    slideshowBtn.onclick = function() {
      startSlideshow(imageNames);
    };
  }
  
  if (statsBtn) {
    statsBtn.onclick = function() {
      showStats();
    };
  }
  
  // Slideshow controls
  const prevBtn = document.getElementById('prevBtn');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const nextBtn = document.getElementById('nextBtn');
  const closeSlideshowBtn = document.getElementById('closeSlideshowBtn');
  
  if (prevBtn) prevBtn.onclick = prevSlideshowImage;
  if (playPauseBtn) playPauseBtn.onclick = toggleSlideshowPlayPause;
  if (nextBtn) nextBtn.onclick = nextSlideshowImage;
  if (closeSlideshowBtn) closeSlideshowBtn.onclick = stopSlideshow;
  
  // Stats modal close
  const closeStatsBtn = document.getElementById('closeStatsBtn');
  if (closeStatsBtn) {
    closeStatsBtn.onclick = function() {
      document.getElementById('statsModal').style.display = 'none';
    };
  }
  
  // Close modal when clicking outside
  const statsModal = document.getElementById('statsModal');
  if (statsModal) {
    statsModal.onclick = function(e) {
      if (e.target === statsModal) {
        statsModal.style.display = 'none';
      }
    };
  }
});

function checkPIN() {
  const input = document.getElementById("pinInput").value;
  // Lấy tham số img nếu có
  const urlParams = new URLSearchParams(window.location.search);
  const imgParam = urlParams.get('img');
  if (input === correctPIN) {
    sessionStorage.setItem("isLoggedIn", "true");
    document.getElementById("login").style.display = "none";
    document.getElementById("navigation").style.display = "flex";
    document.getElementById("gallery").style.display = "none";
    // Nếu có img param, chuyển sang view.html?img=...
    if (imgParam) {
      window.location.href = `view.html?img=${encodeURIComponent(imgParam)}`;
    }
  } else {
    document.getElementById("error").textContent = "Sai mã PIN!";
  }
}

// Danh sách tên file ảnh thực tế
const imageNames = [
  "IMG_2598.JPG", "IMG_2599.JPG", "IMG_2600.JPG", "IMG_2601.JPG", "IMG_2602.JPG", "IMG_2603.JPG", "IMG_2604.JPG",  "IMG_2605.JPG", 
  "IMG_2606.JPG", "IMG_2607.JPG", "IMG_2620.JPG", "IMG_2621.JPG", "IMG_2622.JPG", "IMG_2623.JPG", "IMG_2624.JPG", "IMG_2625.JPG", "IMG_2626.JPG", "IMG_2627.JPG",
  "IMG_2628.JPG", "IMG_2629.JPG",  "IMG_2630.JPG", "IMG_2631.JPG","IMG_2632.JPG", "IMG_2633.JPG", "IMG_2634.JPG",
  "IMG_2635.JPG", "IMG_2636.JPG",  "IMG_2638.JPG", "IMG_2639.JPG", "IMG_2661.JPG", "IMG_2662.JPG",  "IMG_2663.JPG",
  "IMG_2664.JPG","IMG_2680.JPG", "IMG_2681.JPG", "IMG_2683.JPG", "IMG_2684.JPG", "IMG_2685.JPG", "IMG_2686.JPG", "IMG_2687.JPG",
  "IMG_2688.JPG", "IMG_2689.JPG", "IMG_2690.JPG", "IMG_2691.JPG", "IMG_2692.JPG", "IMG_2693.JPG", "IMG_2694.JPG",
  "IMG_2695.JPG",  "IMG_2696.JPG", "IMG_2697.JPG",  "IMG_2698.JPG", "IMG_2699.JPG",
  "IMG_2700.JPG", "IMG_2701.JPG", "IMG_2702.JPG", "IMG_2703.JPG", "IMG_2704.JPG", "IMG_2705.JPG", "IMG_2768.JPG",
  "IMG_2769.JPG", "IMG_2770.JPG", "IMG_2771.JPG", "IMG_2772.JPG", "IMG_2773.JPG", "IMG_2774.JPG", "IMG_2775.JPG", "IMG_2776.JPG", "IMG_2777.JPG", "IMG_2778.JPG", "IMG_2779.JPG",
  "IMG_2780.JPG", "IMG_2781.JPG", "IMG_2782.JPG", "IMG_2783.JPG", "IMG_2784.JPG", "IMG_2785.JPG", "IMG_2786.JPG", "IMG_2787.JPG", "IMG_2788.JPG", "IMG_2789.JPG", "IMG_2790.JPG",
  "IMG_2791.JPG", "IMG_2792.JPG", "IMG_2793.JPG", "IMG_2794.JPG", "IMG_2795.JPG", "IMG_2796.JPG", "IMG_2797.JPG", "IMG_2798.JPG", "IMG_2799.JPG", "IMG_2800.JPG", "IMG_2801.JPG",
  "IMG_2802.JPG", "IMG_2803.JPG", "IMG_2804.JPG", "IMG_2805.JPG", "IMG_2806.JPG", "IMG_2807.JPG", "IMG_2808.JPG", "IMG_2809.JPG", "IMG_2810.JPG", "IMG_2811.JPG", "IMG_2812.JPG",
  "IMG_2813.JPG", "IMG_2814.JPG", "IMG_2815.JPG", "IMG_2816.JPG", "IMG_2817.JPG", "IMG_2818.JPG", "IMG_2819.JPG", "IMG_2820.JPG", "IMG_2821.JPG", "IMG_2822.JPG", "IMG_2823.JPG",
  "IMG_2824.JPG", "IMG_2825.JPG", "IMG_2826.JPG", "IMG_2827.JPG", "IMG_2828.JPG", "IMG_2829.JPG", "IMG_2830.JPG", "IMG_2831.JPG", "IMG_2832.JPG", "IMG_2833.JPG", "IMG_2834.JPG",
  "IMG_2835.JPG", "IMG_2836.JPG", "IMG_2837.JPG", "IMG_2838.JPG", "IMG_2839.JPG", "IMG_2840.JPG", "IMG_2841.JPG", "IMG_2842.JPG", "IMG_2843.JPG", "IMG_2844.JPG", "IMG_2845.JPG",
  "IMG_2846.JPG", "IMG_2847.JPG", "IMG_2848.JPG", "IMG_2849.JPG", "IMG_2850.JPG", "IMG_2851.JPG", "IMG_2852.JPG", "IMG_2853.JPG", "IMG_2854.JPG", "IMG_2855.JPG", "IMG_2856.JPG",
  "IMG_2857.JPG", "IMG_2858.JPG", "IMG_2859.JPG", "IMG_2860.JPG", "IMG_2861.JPG", "IMG_2862.JPG", "IMG_2863.JPG", "IMG_2864.JPG", "IMG_2865.JPG", "IMG_2866.JPG", "IMG_2867.JPG",
  "IMG_2868.JPG", "IMG_2869.JPG", "IMG_2870.JPG", "IMG_2871.JPG", "IMG_2872.JPG", "IMG_2873.JPG", "IMG_2874.JPG", "IMG_2875.JPG", "IMG_2876.JPG", "IMG_2877.JPG", "IMG_2878.JPG",
  "IMG_2879.JPG", "IMG_2880.JPG", "IMG_2881.JPG", "IMG_2882.JPG", "IMG_2883.JPG", "IMG_2884.JPG", "IMG_2885.JPG", "IMG_2886.JPG", "IMG_2887.JPG", "IMG_2888.JPG", "IMG_2889.JPG",
  "IMG_2890.JPG", "IMG_2891.JPG", "IMG_2892.JPG", "IMG_2893.JPG", "IMG_2894.JPG", "IMG_2895.JPG", "IMG_2896.JPG", "IMG_2897.JPG", "IMG_2898.JPG", "IMG_2899.JPG", "IMG_2900.JPG",
  "IMG_2901.JPG", "IMG_2902.JPG", "IMG_2903.JPG", "IMG_2904.JPG", "IMG_2905.JPG", "IMG_2906.JPG", "IMG_2907.JPG", "IMG_2908.JPG", "IMG_2909.JPG", "IMG_2910.JPG", "IMG_2911.JPG",
  "IMG_2912.JPG", "IMG_2913.JPG", "IMG_2914.JPG", "IMG_2915.JPG", "IMG_2916.JPG", "IMG_2917.JPG", "IMG_2918.JPG", "IMG_2919.JPG", "IMG_2920.JPG", "IMG_2921.JPG", "IMG_2922.JPG",
  "IMG_2923.JPG", "IMG_2924.JPG", "IMG_2925.JPG", "IMG_2926.JPG", "IMG_2927.JPG", "IMG_2940.JPG", "IMG_2941.JPG", "IMG_2942.JPG", "IMG_2943.JPG", "IMG_2944.JPG",
  "IMG_2945.JPG", "IMG_2946.JPG", "IMG_2947.JPG", "IMG_2959.JPG", "IMG_2960.JPG", "IMG_2961.JPG", "IMG_2962.JPG", "IMG_2963.JPG", "IMG_2964.JPG", "IMG_2965.JPG", "IMG_2966.JPG",
  "IMG_2967.JPG", "IMG_2968.JPG", "IMG_2969.JPG", "IMG_2970.JPG", "IMG_2971.JPG", "IMG_2972.JPG", "IMG_2973.JPG", "IMG_2974.JPG", "IMG_2975.JPG", "IMG_2976.JPG", "IMG_2977.JPG",
  "IMG_2978.JPG", "IMG_2979.JPG", "IMG_2980.JPG", "IMG_2981.JPG", "IMG_2982.JPG", "IMG_2983.JPG", "IMG_2984.JPG", "IMG_2985.JPG", "IMG_2986.JPG", "IMG_2987.JPG", "IMG_2988.JPG",
  "IMG_2989.JPG", "IMG_2990.JPG", "IMG_2991.JPG", "IMG_2992.JPG", "IMG_2993.JPG", "IMG_2994.JPG", "IMG_2995.JPG", "IMG_2996.JPG", "IMG_2997.JPG", "IMG_2998.JPG", "IMG_2999.JPG",
  "IMG_3000.JPG", "IMG_3001.JPG", "IMG_3002.JPG", "IMG_3003.JPG", "IMG_3004.JPG", "IMG_3005.JPG", "IMG_3006.JPG", "IMG_3007.JPG", "IMG_3008.JPG", "IMG_3009.JPG", "IMG_3010.JPG",
  "IMG_3011.JPG", "IMG_3012.JPG", "IMG_3013.JPG", "IMG_3014.JPG", "IMG_3015.JPG", "IMG_3016.JPG", "IMG_3017.JPG", "IMG_3018.JPG", "IMG_3019.JPG", "IMG_3020.JPG", "IMG_3021.JPG",
  "IMG_3022.JPG", "IMG_3023.JPG", "IMG_3024.JPG", "IMG_3025.JPG", "IMG_3026.JPG", "IMG_3027.JPG", "IMG_3028.JPG", "IMG_3029.JPG", "IMG_3030.JPG", "IMG_3031.JPG", "IMG_3032.JPG",
  "IMG_3033.JPG", "IMG_3034.JPG", "IMG_3035.JPG", "IMG_3036.JPG", "IMG_3037.JPG", "IMG_3038.JPG", "IMG_3039.JPG", "IMG_3040.JPG", "IMG_3044.JPG", "IMG_3045.JPG", "IMG_3046.JPG",
  "IMG_3047.JPG", "IMG_3048.JPG", "IMG_3049.JPG", "IMG_3050.JPG", "IMG_3051.JPG", "IMG_3052.JPG", "IMG_3053.JPG", "IMG_3054.JPG", "IMG_3055.JPG", "IMG_3056.JPG", "IMG_3057.JPG",
  "IMG_3058.JPG", "IMG_3059.JPG", "IMG_3060.JPG", "IMG_3061.JPG", "IMG_3062.JPG", "IMG_3063.JPG", "IMG_3064.JPG", "IMG_3065.JPG", "IMG_3066.JPG", "IMG_3086.JPG", "IMG_3087.JPG",
  "IMG_3088.JPG", "IMG_3089.JPG", "IMG_3090.JPG", "IMG_3091.JPG", "IMG_3092.JPG", "IMG_3093.JPG", "IMG_3094.JPG", "IMG_3095.JPG", "IMG_3096.JPG", "IMG_3097.JPG", "IMG_3098.JPG",
  "IMG_3099.JPG", "IMG_3100.JPG", "IMG_3101.JPG", "IMG_3102.JPG", "IMG_3103.JPG", "IMG_3104.JPG", "IMG_3105.JPG", "IMG_3106.JPG", "IMG_3107.JPG", "IMG_3108.JPG", "IMG_3109.JPG",
  "IMG_3110.JPG", "IMG_3111.JPG", "IMG_3112.JPG", "IMG_3113.JPG", "IMG_3114.JPG", "IMG_3115.JPG", "IMG_3116.JPG", "IMG_3117.JPG", "IMG_3118.JPG", "IMG_3119.JPG", "IMG_3120.JPG",
  "IMG_3121.JPG", "IMG_3122.JPG", "IMG_3123.JPG", "IMG_3124.JPG", "IMG_3125.JPG", "IMG_3126.JPG", "IMG_3127.JPG", "IMG_3128.JPG", "IMG_3129.JPG", "IMG_3130.JPG", "IMG_3131.JPG",
  "IMG_3132.JPG", "IMG_3133.JPG", "IMG_3134.JPG", "IMG_3135.JPG", "IMG_3136.JPG", "IMG_3137.JPG", "IMG_3138.JPG", "IMG_3139.JPG", "IMG_3140.JPG", "IMG_3141.JPG",
  "IMG_3142.JPG", "IMG_3143.JPG", "IMG_3144.JPG", "IMG_3145.JPG", "IMG_3146.JPG", "IMG_3147.JPG", "IMG_3148.JPG", "IMG_3149.JPG", "IMG_3150.JPG", "IMG_3151.JPG", "IMG_3152.JPG",
  "IMG_3153.JPG", "IMG_3154.JPG", "IMG_3155.JPG", "IMG_3156.JPG", "IMG_3157.JPG", "IMG_3158.JPG", "IMG_3159.JPG", "IMG_3160.JPG", "IMG_3161.JPG", "IMG_3162.JPG", "IMG_3163.JPG",
  "IMG_3164.JPG", "IMG_3165.JPG", "IMG_3166.JPG", "IMG_3167.JPG", "IMG_3168.JPG", "IMG_3169.JPG", "IMG_3170.JPG"
];

// Preload ảnh cho trang tiếp theo
function preloadNextPage(imageList, nextPage) {
  const startIndex = (nextPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const nextPageImages = imageList.slice(startIndex, endIndex);
  
  nextPageImages.forEach(imageName => {
    const img = new Image();
    img.src = `images/${imageName}`;
  });
}

function loadImagesWithPagination(imageList) {
  if (isLoading) return; // Tránh spam click
  isLoading = true;
  
  const gallery = document.getElementById("gallery");
  
  // Tạo container mới thay vì xóa toàn bộ
  let imagesContainer = gallery.querySelector(".images-container");
  if (!imagesContainer) {
    imagesContainer = document.createElement("div");
    imagesContainer.className = "images-container";
    imagesContainer.style.display = "flex";
    imagesContainer.style.flexWrap = "wrap";
    imagesContainer.style.gap = "10px";
    imagesContainer.style.justifyContent = "center";
    gallery.appendChild(imagesContainer);
  }
  
  // Xóa nội dung cũ
  imagesContainer.innerHTML = "";
  
  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const currentPageImages = imageList.slice(startIndex, endIndex);
  
  currentPageImages.forEach(imageName => {
    const imageWrapper = document.createElement("div");
    imageWrapper.className = "image-wrapper";
    
    const img = document.createElement("img");
    img.src = `images/${imageName}`;
    img.className = "thumbnail";
    img.alt = imageName;
    img.onclick = function() {
      addToHistory(imageName);
      window.location.href = `view.html?img=${encodeURIComponent(imageName)}`;
    };
    
    // Thêm nút yêu thích
    const favoriteBtn = document.createElement("button");
    favoriteBtn.className = "favorite-btn";
    favoriteBtn.setAttribute("data-image", imageName);
    favoriteBtn.innerHTML = isFavorite(imageName) ? "❤️" : "🤍";
    favoriteBtn.onclick = function(e) {
      e.stopPropagation();
      toggleFavorite(imageName);
    };
    
    imageWrapper.appendChild(img);
    imageWrapper.appendChild(favoriteBtn);
    imagesContainer.appendChild(imageWrapper);
  });
  
  // Tạo pagination
  const totalPages = Math.ceil(imageList.length / imagesPerPage);
  createPagination(totalPages);
  
  // Preload trang tiếp theo
  if (currentPage < totalPages) {
    preloadNextPage(imageList, currentPage + 1);
  }
  
  isLoading = false;
}

function createPagination(totalPages) {
  const gallery = document.getElementById("gallery");
  
  // Xóa pagination cũ
  const oldPagination = gallery.querySelector(".pagination");
  if (oldPagination) {
    oldPagination.remove();
  }
  
  if (totalPages <= 1) return;
  
  const pagination = document.createElement("div");
  pagination.className = "pagination";
  pagination.style.display = "flex";
  pagination.style.justifyContent = "center";
  pagination.style.alignItems = "center";
  pagination.style.gap = "5px";
  pagination.style.marginTop = "20px";
  pagination.style.flexWrap = "wrap";
  
  // Nút Previous
  if (currentPage > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.className = "page-btn";
    prevBtn.textContent = "←";
    prevBtn.onclick = function() {
      currentPage--;
      loadImagesWithPagination(currentImageList);
    };
    pagination.appendChild(prevBtn);
  }
  
  // Hiển thị tối đa 5 trang
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  // Nút trang đầu
  if (startPage > 1) {
    const firstBtn = document.createElement("button");
    firstBtn.className = "page-btn";
    firstBtn.textContent = "1";
    firstBtn.onclick = function() {
      currentPage = 1;
      loadImagesWithPagination(currentImageList);
    };
    pagination.appendChild(firstBtn);
    
    if (startPage > 2) {
      const ellipsis = document.createElement("span");
      ellipsis.textContent = "...";
      ellipsis.style.margin = "0 5px";
      pagination.appendChild(ellipsis);
    }
  }
  
  // Các nút trang
  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = "page-btn";
    pageBtn.textContent = i;
    if (i === currentPage) {
      pageBtn.classList.add("active");
    }
    pageBtn.onclick = function() {
      currentPage = i;
      loadImagesWithPagination(currentImageList);
    };
    pagination.appendChild(pageBtn);
  }
  
  // Nút trang cuối
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const ellipsis = document.createElement("span");
      ellipsis.textContent = "...";
      ellipsis.style.margin = "0 5px";
      pagination.appendChild(ellipsis);
    }
    
    const lastBtn = document.createElement("button");
    lastBtn.className = "page-btn";
    lastBtn.textContent = totalPages;
    lastBtn.onclick = function() {
      currentPage = totalPages;
      loadImagesWithPagination(currentImageList);
    };
    pagination.appendChild(lastBtn);
  }
  
  // Nút Next
  if (currentPage < totalPages) {
    const nextBtn = document.createElement("button");
    nextBtn.className = "page-btn";
    nextBtn.textContent = "→";
    nextBtn.onclick = function() {
      currentPage++;
      loadImagesWithPagination(currentImageList);
    };
    pagination.appendChild(nextBtn);
  }
  
  gallery.appendChild(pagination);
}

function loadImages(list) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  
  list.forEach(imageName => {
    const img = document.createElement("img");
    img.src = `images/${imageName}`;
    img.className = "thumbnail";
    img.alt = imageName;
    img.onclick = function() {
      addToHistory(imageName);
      window.location.href = `view.html?img=${encodeURIComponent(imageName)}`;
    };
    gallery.appendChild(img);
  });
}

// Mini Game logic
let miniGameState = {
  image: '',
  covers: [true, true, true, true],
  level: 1,
  maxLevel: 4,
  isPlaying: false
};

function openMiniGame() {
  // Chọn ảnh ngẫu nhiên
  const randomImg = imageNames[Math.floor(Math.random() * imageNames.length)];
  miniGameState.image = randomImg;
  miniGameState.covers = [true, true, true, true];
  miniGameState.level = 1;
  miniGameState.isPlaying = true;
  // Hiển thị modal
  document.getElementById('miniGameModal').style.display = 'flex';
  document.getElementById('miniGameImage').src = `images/${randomImg}`;
  // Hiển thị lại các ô che
  for (let i = 0; i < 4; i++) {
    document.getElementById('coverBlock' + i).style.display = 'block';
  }
  document.getElementById('miniGameLevel').textContent = miniGameState.level;
  document.getElementById('miniGameCovers').textContent = miniGameState.covers.filter(x=>x).length;
  document.getElementById('miniGameMessage').textContent = '';
  // Khởi tạo game hứng đồ rơi (sẽ bổ sung sau)
  initMiniGameLevel();
}

function closeMiniGame() {
  document.getElementById('miniGameModal').style.display = 'none';
  miniGameState.isPlaying = false;
}

// Gắn sự kiện cho nút
window.addEventListener('DOMContentLoaded', function() {
  const miniGameBtn = document.getElementById('miniGameBtn');
  if (miniGameBtn) miniGameBtn.onclick = function() {
    window.location.href = 'minigame.html';
  };
});

// Khởi tạo game hứng đồ rơi (placeholder)
function initMiniGameLevel() {
  const ctx = document.getElementById('miniGameCanvas').getContext('2d');
  ctx.clearRect(0, 0, 320, 320);
  ctx.fillStyle = '#667eea';
  ctx.font = 'bold 24px Inter, Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Mini game sẽ xuất hiện ở đây!', 160, 160);
}
