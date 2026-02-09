/**
 * 챗봇 페이지 인터랙션 및 기능 관리
 */

// DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
  initializeQuickQuestions();
  initializeChatbotIframe();
  addSmoothScroll();
});

/**
 * 빠른 질문 버튼 기능 초기화
 * 버튼 클릭 시 챗봇에 메시지를 전달하는 기능
 */
function initializeQuickQuestions() {
  const quickQuestionButtons = document.querySelectorAll('.quick-question-btn');
  
  quickQuestionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const question = this.getAttribute('data-question');
      
      if (question) {
        // 버튼 클릭 시각적 피드백
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
        
        // 챗봇 iframe에 메시지 전달 시도
        sendMessageToChatbot(question);
        
        // 사용자에게 피드백 제공
        showNotification(`"${question}" 메시지를 전송했습니다.`);
      }
    });
  });
}

/**
 * 챗봇 iframe에 메시지 전송
 * @param {string} message - 전송할 메시지
 */
function sendMessageToChatbot(message) {
  try {
    const iframe = document.querySelector('.chatbot-iframe');
    
    if (iframe && iframe.contentWindow) {
      // Microsoft Copilot Studio의 경우, iframe 내부의 웹챗 API를 통해 메시지 전송
      // 실제 구현은 챗봇 플랫폼의 API에 따라 다를 수 있습니다
      iframe.contentWindow.postMessage({
        type: 'message',
        text: message
      }, '*');
    }
  } catch (error) {
    console.log('챗봇 메시지 전송 중 오류가 발생했습니다:', error);
    // 사용자에게는 오류를 표시하지 않고 조용히 처리
  }
}

/**
 * 챗봇 iframe 초기화 및 로드 이벤트 처리
 */
function initializeChatbotIframe() {
  const iframe = document.querySelector('.chatbot-iframe');
  
  if (iframe) {
    // iframe 로드 완료 시 처리
    iframe.addEventListener('load', function() {
      console.log('챗봇이 성공적으로 로드되었습니다.');
      
      // 로드 완료 시 시각적 피드백 (선택사항)
      const statusIndicator = document.querySelector('.status-indicator');
      if (statusIndicator) {
        statusIndicator.style.background = '#10b981';
      }
    });
    
    // iframe 로드 오류 처리
    iframe.addEventListener('error', function() {
      console.error('챗봇 로드 중 오류가 발생했습니다.');
      showNotification('챗봇을 불러오는 중 문제가 발생했습니다. 페이지를 새로고침해주세요.', 'error');
    });
  }
}

/**
 * 부드러운 스크롤 기능 추가
 */
function addSmoothScroll() {
  // 빠른 질문 버튼 클릭 시 챗봇 영역으로 스크롤
  const quickQuestionButtons = document.querySelectorAll('.quick-question-btn');
  const chatbotContainer = document.querySelector('.chatbot-container');
  
  quickQuestionButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (chatbotContainer && window.innerWidth <= 1024) {
        // 모바일/태블릿에서만 스크롤 이동
        setTimeout(() => {
          chatbotContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 300);
      }
    });
  });
}

/**
 * 사용자에게 알림 메시지 표시
 * @param {string} message - 표시할 메시지
 * @param {string} type - 메시지 타입 ('success' 또는 'error')
 */
function showNotification(message, type = 'success') {
  // 기존 알림이 있으면 제거
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // 알림 요소 생성
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // 스타일 적용
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'error' ? '#ef4444' : '#10b981'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
    font-size: 14px;
    font-weight: 500;
  `;
  
  // 애니메이션 스타일 추가
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // 3초 후 자동 제거
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

/**
 * 페이지 가시성 변경 시 처리 (탭 전환 등)
 */
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // 페이지가 숨겨졌을 때 처리 (필요시)
    console.log('페이지가 백그라운드로 이동했습니다.');
  } else {
    // 페이지가 다시 보일 때 처리 (필요시)
    console.log('페이지가 다시 활성화되었습니다.');
  }
});

/**
 * 반응형 레이아웃 조정을 위한 리사이즈 이벤트 처리
 */
let resizeTimer;
window.addEventListener('resize', function() {
  // 리사이즈 이벤트가 너무 자주 발생하는 것을 방지
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    // 필요시 레이아웃 조정 로직 추가
    console.log('화면 크기가 변경되었습니다.');
  }, 250);
});