/**
 * 💡 푸터 아코디언 UI 스크립트 (BREAKPOINT 1024px 포함 작동 버전)
 */
(function ($) {
    // ⬇️ [필수 설정] 브레이크포인트 변수 설정
    // 1024px '이하'에서 아코디언이 작동합니다.
    const BREAKPOINT_WIDTH = 1024;

    // 1. 콘텐츠 래퍼 구조화 함수 (변경 없음)
    const wrapContents = function ($item) {
        const $title = $item.children('[data-ez-role="title"]').first();
        const $contentElements = $title.nextAll();
        
        // 래퍼가 없으면 새로 생성
        if ($contentElements.length > 0 && !$item.children('.accordion-content-wrapper').length) {
            $contentElements.wrapAll('<div class="accordion-content-wrapper" />');
        }
    };

    // 2. 아코디언 토글 함수 정의
    const toggleAccordion = function (event) {
        event.preventDefault(); 
        
        // ⭐ [수정] 1024px '초과'일 때 기능 작동 차단
        if ($(window).width() > BREAKPOINT_WIDTH) { 
            return;
        }

        const $item = $(this).closest('.accordion-item');
        // 현재 펼쳐져 있는지 확인
        const is_active = $item.hasClass('active') && $item.children('.accordion-content-wrapper').is(':visible');
        const $content = $item.children('.accordion-content-wrapper');

        if (!$content.length) return;

        // 현재 진행 중인 애니메이션을 중지 (필수)
        $content.stop(true, true); 

        if (is_active) {
            // 재접힘 로직 
            $content.slideUp(300, function() {
                $item.removeClass('active');
                // 애니메이션 완료 후 인라인 스타일 제거 (CSS의 display: none이 적용됨)
                $(this).removeAttr('style'); 
            });
        } else {
            // 다른 항목 접기 (단독 아코디언)
            $item.siblings('.accordion-item.active').each(function() {
                const $siblingItem = $(this);
                const $siblingContent = $siblingItem.children('.accordion-content-wrapper');
                
                if ($siblingContent.length) {
                    $siblingContent.stop(true, true).slideUp(300, function() {
                        $siblingItem.removeClass('active');
                        $(this).removeAttr('style');
                    });
                }
            });

            // 현재 항목 펴기
            $item.addClass('active');
            $content.slideDown(300);
        }
    };

    // 3. 초기화 및 리사이즈 이벤트 핸들러 정의
    const handleAccordionState = function () {
        const window_width = $(window).width();
        const $items = $('#footer').find('[data-ez-group].accordion-item');

        // A. 모든 아코디언 아이템의 콘텐츠를 래핑 (가장 먼저 수행)
        $items.each(function() {
            wrapContents($(this));
        });

        // ⭐ [수정] 1024px '이하'에서 모바일 환경 로직 실행
        if (window_width <= BREAKPOINT_WIDTH) { 
            // 📱 모바일 환경 (1024px 이하)
            $items.each(function() {
                const $item = $(this);
                const $title = $item.children('[data-ez-role="title"]').first();
                // const $content = $item.children('.accordion-content-wrapper'); // 사용하지 않음
                
                // 이벤트 바인딩
                $title.off('click.accordion-handler').on('click.accordion-handler', toggleAccordion);
                
                // C. 모바일 진입 시 초기 상태는 '접힘' (CSS가 처리)
                $item.removeClass('active');
            });
        } else {
            // 🖥️ PC 환경 (1024px 초과)
            $items.each(function() {
                const $item = $(this);
                const $title = $item.children('[data-ez-role="title"]').first();
                const $content = $item.children('.accordion-content-wrapper');
                
                // 클릭 이벤트 제거
                $title.off('click.accordion-handler');
                
                // 콘텐츠 초기 상태: 모두 보이기
                if ($content.length) {
                    // CSS의 display: none을 덮어쓰고 active 클래스 제거
                    $content.show().removeAttr('style'); 
                }
                $item.removeClass('active'); 
            });
        }
    };

    // DOM이 완전히 로드된 후 스크립트 실행
    $(document).ready(function () {
        handleAccordionState();
        $(window).on('resize', handleAccordionState);
    });
})(jQuery);