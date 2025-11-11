jQuery(document).ready(function ($) {
  
  // ========================================
  // 헤더 검색박스 기능
  // ========================================
  
  const $searchLi = $('.top_mypage .top_search');
  
  if ($searchLi.length > 0) {
    // 기존 eSearch 링크의 클릭 이벤트 제거
    $searchLi.find('.eSearch').off('click').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
    
    // 기존 내용 완전히 비우고 교체
    $searchLi.empty().html(`
      <input type="text" 
             class="search_input" 
             id="headerSearchInput"
             autocomplete="off"
             aria-label="상품 검색">
      <button type="button" 
              class="search_btn" 
              id="headerSearchBtn"
              aria-label="검색">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </button>
    `);
    
    // 모바일 검색 오버레이 HTML 추가
    if ($('#mobileSearchOverlay').length === 0) {
      $('body').append(`
        <div id="mobileSearchOverlay">
          <div class="mobile-search-container">
            <div class="mobile-search-header">
              <span class="mobile-search-title">상품 검색</span>
              <button type="button" class="mobile-search-close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="mobile-search-input-wrap">
              <input type="text" 
                     class="mobile-search-input" 
                     id="mobileSearchInput"
                     placeholder="검색어를 입력하세요"
                     autocomplete="off">
              <button type="button" class="mobile-search-submit">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `);
    }
    
    console.log('검색창 초기화 완료!');
    
    // 요소 가져오기
    const $searchInput = $('#headerSearchInput');
    const $searchBtn = $('#headerSearchBtn');
    const $mobileOverlay = $('#mobileSearchOverlay');
    const $mobileInput = $('#mobileSearchInput');
    const $mobileSubmit = $('.mobile-search-submit');
    const $mobileClose = $('.mobile-search-close');
    
    // 검색 실행 함수
    function executeSearch(keyword) {
      if (keyword.trim() === '') {
        alert('검색어를 입력해주세요.');
        return;
      }
      
      const searchUrl = '/product/search.html?keyword=' + encodeURIComponent(keyword.trim());
      window.location.href = searchUrl;
    }
    
    // PC/태블릿: 검색 버튼 클릭
    $searchBtn.on('click', function(e) {
      e.preventDefault();
      
      if ($(window).width() <= 440) {
        // 모바일: 오버레이 열기
        $mobileOverlay.addClass('active');
        setTimeout(function() {
          $mobileInput.focus();
        }, 300);
      } else {
        // PC/태블릿: 바로 검색
        executeSearch($searchInput.val());
      }
    });
    
    // PC/태블릿: Enter 키
    $searchInput.on('keypress', function(e) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        executeSearch($(this).val());
      }
    });
    
    // 모바일: 검색 버튼 클릭
    $mobileSubmit.on('click', function() {
      executeSearch($mobileInput.val());
    });
    
    // 모바일: Enter 키
    $mobileInput.on('keypress', function(e) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        executeSearch($(this).val());
      }
    });
    
    // 모바일: 닫기 버튼
    $mobileClose.on('click', function() {
      $mobileOverlay.removeClass('active');
      $mobileInput.val('');
    });
    
    // 모바일: 배경 클릭 시 닫기
    $mobileOverlay.on('click', function(e) {
      if ($(e.target).is('#mobileSearchOverlay')) {
        $mobileOverlay.removeClass('active');
        $mobileInput.val('');
      }
    });
    
    // PC/태블릿: 검색창 포커스 애니메이션
    $searchInput.on('focus', function() {
      $(this).css('border-bottom-color', '#333');
    });
    
    $searchInput.on('blur', function() {
      $(this).css('border-bottom-color', '#000');
    });
  }
  
  
  // ========================================
  // Swiper 슬라이더
  // ========================================
  
  const $visual = $(".visual_swiper");
  let visual_swiper = null;

  if (typeof Swiper !== "undefined" && $visual.length) {
    if ($visual.hasClass("swiper-initialized")) {
      visual_swiper = $visual[0].swiper || null;
    } else {
      visual_swiper = new Swiper(".visual_swiper", {
        direction: "horizontal",
        loop: true,
        centeredSlides: true,
        slidesPerView: "auto",
        autoplay: { 
          delay: 2500, 
          disableOnInteraction: false 
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        observer: true,
        observeParents: true,
        watchOverflow: true,
        preloadImages: false,
        lazy: { loadPrevNext: true, loadPrevNextAmount: 1 },
        speed: 600,
        watchSlidesProgress: true,

        on: {
          init: function () {
            updateCustomPagination(this);
          },
          slideChange: function () {
            updateCustomPagination(this);
          },
        },
      });

      // 커스텀 페이지네이션 클릭 이벤트
      $('.swiper-pagination-custom li').on('click', function() {
        const index = $(this).index();
        visual_swiper.slideToLoop(index);
      });
    }

    // 커스텀 페이지네이션 업데이트 함수
    function updateCustomPagination(swiper) {
      $('.swiper-pagination-custom li').removeClass('active');
      $('.swiper-pagination-custom li').eq(swiper.realIndex).addClass('active');
    }

    // 재생/일시정지 버튼 기능
    const $autoplayToggleBtn = $("#btn-autoplay-toggle");
    const $playIcon = $("#icon-play");
    const $pauseIcon = $("#icon-pause");
    let isPlaying = true;

    if ($autoplayToggleBtn.length && visual_swiper) {
      $autoplayToggleBtn.on("click", function () {
        if (isPlaying) {
          visual_swiper.autoplay && visual_swiper.autoplay.stop();
          $playIcon.removeClass("hidden");
          $pauseIcon.addClass("hidden");
        } else {
          visual_swiper.autoplay && visual_swiper.autoplay.start();
          $playIcon.addClass("hidden");
          $pauseIcon.removeClass("hidden");
        }
        isPlaying = !isPlaying;
      });
    }
  }
});


// ========================================
// 상품분류 아코디언
// ========================================

function initCategoryAccordion() {
  const $cateTitles = $('.cate-title');
  
  // 현재 페이지 URL에서 카테고리 번호 추출
  const currentUrl = window.location.pathname + window.location.search;
  let currentCategoryNo = null;
  
  // URL 패턴: /skin-skin7/category/글속기타/90/ 또는 category_no=90
  const pathMatch = currentUrl.match(/\/category\/[^/]+\/(\d+)/);
  const queryMatch = currentUrl.match(/category_no=(\d+)/);
  
  if (pathMatch) {
    currentCategoryNo = pathMatch[1];
  } else if (queryMatch) {
    currentCategoryNo = queryMatch[1];
  }
  
  console.log('현재 카테고리 번호:', currentCategoryNo);
  
  $cateTitles.each(function() {
    const $title = $(this);
    
    // 이미 화살표가 있으면 건너뛰기
    if ($title.find('.accordion-arrow').length > 0) return;
    
    // 화살표 HTML 생성
    const arrowHtml = `
      <span class="accordion-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
    `;
    
    // h2에 화살표 추가
    $title.append(arrowHtml);
    
    // 클릭 이벤트 추가
    $title.on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('클릭됨!');
      
      // category-accordion-wrap 찾기
      const $wrapper = $(this).closest('.category-accordion-wrap');
      
      if ($wrapper.length === 0) {
        console.log('wrapper를 찾을 수 없습니다');
        return;
      }
      
      // PC와 태블릿용 메뉴 찾기
      const $pcMenu = $wrapper.find('.display_pc_only .menuCategory.menu');
      const $tabletMenu = $wrapper.find('.display_tablet_only .menuCategory.menu');
      
      console.log('PC 메뉴:', $pcMenu.length, 'Tablet 메뉴:', $tabletMenu.length);
      
      // active 클래스 토글
      $(this).toggleClass('active');
      
      // 메뉴 표시/숨김 토글
      if ($pcMenu.length > 0) $pcMenu.toggleClass('show');
      if ($tabletMenu.length > 0) $tabletMenu.toggleClass('show');
    });
    
    // 초기 상태 설정
    const $wrapper = $title.closest('.category-accordion-wrap');
    if ($wrapper.length > 0) {
      const $pcMenu = $wrapper.find('.display_pc_only .menuCategory.menu');
      const $tabletMenu = $wrapper.find('.display_tablet_only .menuCategory.menu');
      
      // 현재 카테고리와 일치하는지 확인
      let shouldBeOpen = false;
      
      if (currentCategoryNo) {
        // 하위 카테고리 링크들을 확인
        const $categoryLinks = $wrapper.find('a[href*="category"]');
        
        $categoryLinks.each(function() {
          const href = $(this).attr('href');
          if (href) {
            // href에서 카테고리 번호 추출
            const linkPathMatch = href.match(/\/category\/[^/]+\/(\d+)/);
            const linkQueryMatch = href.match(/category_no=(\d+)/);
            
            let linkCategoryNo = null;
            if (linkPathMatch) {
              linkCategoryNo = linkPathMatch[1];
            } else if (linkQueryMatch) {
              linkCategoryNo = linkQueryMatch[1];
            }
            
            // 현재 페이지의 카테고리 번호와 일치하면 열림 상태로 설정
            if (linkCategoryNo === currentCategoryNo) {
              shouldBeOpen = true;
              return false; // each 루프 종료
            }
          }
        });
      }
      
      if (shouldBeOpen) {
        // 현재 카테고리면 열린 상태로 유지
        $title.addClass('active');
        $pcMenu.addClass('show');
        $tabletMenu.addClass('show');
        console.log('현재 카테고리 아코디언 열림 유지');
      } else {
        // 다른 카테고리면 닫힌 상태
        $pcMenu.removeClass('show');
        $tabletMenu.removeClass('show');
      }
    }
  });
}

// jQuery ready 내부에서 실행
$(document).ready(function() {
  initCategoryAccordion();
});