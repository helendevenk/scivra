/**
 * Autopilot Engine
 *
 * Generates a self-contained IIFE script string that is injected into the
 * UPG iframe. The script handles:
 * - DOM state reading via data-autopilot attributes
 * - Action execution (set_slider, click_button, select_quiz_option, tutor_speak)
 * - Smooth slider animation (20 steps × 30ms)
 * - Tutor UI (glassmorphism chat panel, bottom-right)
 * - postMessage bridge with parent window
 */
export function generateAutopilotScript(sessionId: string, language: 'zh' | 'en'): string {
  const labels = language === 'zh'
    ? {
        thinking: '思考中...',
        tutorName: 'AI 物理导师',
        sessionEnd: '本次引导结束，祝学习愉快！',
        sliderNotFound: (name: string) => `找不到滑块: ${name}`,
        btnNotFound: (btn: string) => `找不到按钮: ${btn}`,
        optionNotFound: (i: number) => `找不到选项: ${i}`,
        done: '会话完成',
      }
    : {
        thinking: 'Thinking...',
        tutorName: 'AI Physics Tutor',
        sessionEnd: 'Session complete. Happy learning!',
        sliderNotFound: (name: string) => `Slider not found: ${name}`,
        btnNotFound: (btn: string) => `Button not found: ${btn}`,
        optionNotFound: (i: number) => `Option not found: ${i}`,
        done: 'Session complete',
      };

  // Inline labels as JSON to avoid closure issues inside the IIFE string
  const labelsJson = JSON.stringify(labels);

  return `
(function() {
  'use strict';
  var SESSION_ID = ${JSON.stringify(sessionId)};
  var LABELS = ${labelsJson};

  // ── Tutor UI ──────────────────────────────────────────────────────────────

  var panel, msgList, thinkingEl;

  function createTutorUI() {
    var style = document.createElement('style');
    style.textContent = [
      '#__ap-panel {',
      '  position: fixed; bottom: 20px; right: 20px; width: 320px;',
      '  max-height: 400px; z-index: 99999;',
      '  background: rgba(15,23,42,0.85); backdrop-filter: blur(12px);',
      '  border: 1px solid rgba(6,182,212,0.3); border-radius: 16px;',
      '  box-shadow: 0 8px 32px rgba(0,0,0,0.5); display: flex; flex-direction: column;',
      '  font-family: system-ui, sans-serif; overflow: hidden;',
      '}',
      '#__ap-header {',
      '  padding: 10px 14px; background: rgba(6,182,212,0.15);',
      '  border-bottom: 1px solid rgba(6,182,212,0.2);',
      '  font-size: 12px; font-weight: 600; color: #67e8f9;',
      '  display: flex; align-items: center; gap: 8px;',
      '}',
      '#__ap-header::before {',
      '  content: ""; display: inline-block; width: 8px; height: 8px;',
      '  background: #22d3ee; border-radius: 50%;',
      '  box-shadow: 0 0 6px #22d3ee; animation: __ap-pulse 1.5s infinite;',
      '}',
      '#__ap-msgs {',
      '  flex: 1; overflow-y: auto; padding: 10px 12px; display: flex;',
      '  flex-direction: column; gap: 8px;',
      '}',
      '.ap-msg {',
      '  background: rgba(6,182,212,0.1); border-left: 2px solid #22d3ee;',
      '  padding: 8px 10px; border-radius: 0 8px 8px 0;',
      '  font-size: 12px; line-height: 1.5; color: #e2e8f0;',
      '}',
      '#__ap-thinking {',
      '  padding: 8px 12px; font-size: 11px; color: #94a3b8;',
      '  font-style: italic; display: none;',
      '}',
      '@keyframes __ap-pulse {',
      '  0%,100% { opacity: 1; } 50% { opacity: 0.4; }',
      '}',
    ].join('');
    document.head.appendChild(style);

    panel = document.createElement('div');
    panel.id = '__ap-panel';
    panel.innerHTML = '<div id="__ap-header">' + LABELS.tutorName + '</div>' +
      '<div id="__ap-msgs"></div>' +
      '<div id="__ap-thinking">' + LABELS.thinking + '</div>';
    document.body.appendChild(panel);

    msgList = document.getElementById('__ap-msgs');
    thinkingEl = document.getElementById('__ap-thinking');
  }

  function addMessage(text) {
    if (!msgList) return;
    var div = document.createElement('div');
    div.className = 'ap-msg';
    div.textContent = text;
    msgList.appendChild(div);
    msgList.scrollTop = msgList.scrollHeight;
  }

  function setThinking(on) {
    if (thinkingEl) thinkingEl.style.display = on ? 'block' : 'none';
  }

  // ── DOM State Reader ──────────────────────────────────────────────────────

  function getVisualizationState() {
    var state = { title: '', sliders: [], buttons: {}, quiz: null };

    // Title
    var titleEl = document.querySelector('[data-autopilot="title"]');
    if (titleEl) state.title = titleEl.textContent.trim();

    // Sliders
    var sliderEls = document.querySelectorAll('[data-autopilot^="slider-"]');
    sliderEls.forEach(function(el) {
      var name = el.getAttribute('data-autopilot').replace('slider-', '');
      state.sliders.push({
        name: name,
        label: el.getAttribute('data-slider-label') || name,
        value: parseFloat(el.value) || 0,
        min: parseFloat(el.getAttribute('data-slider-min') || el.min) || 0,
        max: parseFloat(el.getAttribute('data-slider-max') || el.max) || 100,
        unit: el.getAttribute('data-slider-unit') || '',
      });
    });

    // Buttons
    ['play', 'pause', 'reset', 'random'].forEach(function(btn) {
      var el = document.querySelector('[data-autopilot="btn-' + btn + '"]');
      if (el) state.buttons[btn] = true;
    });

    // Quiz
    var quizPanel = document.querySelector('[data-autopilot="quiz-panel"]');
    if (quizPanel) {
      var questionEl = quizPanel.querySelector('[data-autopilot="quiz-question"]');
      var question = questionEl ? questionEl.textContent.trim() : '';
      var options = [];
      var i = 0;
      while (true) {
        var optEl = quizPanel.querySelector('[data-autopilot="quiz-option-' + i + '"]');
        if (!optEl) break;
        options.push({
          index: i,
          text: optEl.textContent.trim(),
          selected: optEl.classList.contains('selected') || optEl.classList.contains('active'),
        });
        i++;
      }
      if (question || options.length > 0) {
        state.quiz = { question: question, options: options };
      }
    }

    return state;
  }

  // ── Action Executor ──────────────────────────────────────────────────────

  function animateSlider(el, targetValue) {
    var startValue = parseFloat(el.value) || 0;
    var delta = targetValue - startValue;
    var steps = 20;
    var currentStep = 0;
    var interval = setInterval(function() {
      currentStep++;
      var progress = currentStep / steps;
      el.value = startValue + delta * progress;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      if (currentStep >= steps) {
        clearInterval(interval);
        el.value = targetValue;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, 30);
  }

  function executeAction(action) {
    var actionName = Object.keys(action)[0];
    var params = action[actionName];

    if (actionName === 'set_slider') {
      var el = document.querySelector('[data-autopilot="slider-' + params.name + '"]');
      if (!el) return sendResult(LABELS.sliderNotFound(params.name));
      animateSlider(el, params.value);
      setTimeout(function() { sendResult('ok'); }, 700);
      return;
    }

    if (actionName === 'click_button') {
      var btn = document.querySelector('[data-autopilot="btn-' + params.button + '"]');
      if (!btn) return sendResult(LABELS.btnNotFound(params.button));
      btn.click();
      sendResult('ok');
      return;
    }

    if (actionName === 'select_quiz_option') {
      var quizPanel = document.querySelector('[data-autopilot="quiz-panel"]');
      if (!quizPanel) return sendResult('quiz panel not found');
      var opt = quizPanel.querySelector('[data-autopilot="quiz-option-' + params.index + '"]');
      if (!opt) return sendResult(LABELS.optionNotFound(params.index));
      opt.click();
      sendResult('ok');
      return;
    }

    if (actionName === 'tutor_speak') {
      setThinking(false);
      addMessage(params.message);
      sendResult('ok');
      return;
    }

    if (actionName === 'get_visualization_state') {
      var stateData = getVisualizationState();
      window.parent.postMessage({
        type: 'autopilot:state',
        sessionId: SESSION_ID,
        state: stateData,
      }, '*');
      sendResult('state_sent');
      return;
    }

    if (actionName === 'get_quiz_state') {
      var stateData2 = getVisualizationState();
      window.parent.postMessage({
        type: 'autopilot:state',
        sessionId: SESSION_ID,
        state: stateData2,
      }, '*');
      sendResult('quiz_state_sent');
      return;
    }

    if (actionName === 'done') {
      setThinking(false);
      addMessage(params.summary || LABELS.sessionEnd);
      window.parent.postMessage({
        type: 'autopilot:done',
        sessionId: SESSION_ID,
      }, '*');
      sendResult('done');
      return;
    }

    sendResult('unknown action: ' + actionName);
  }

  function sendResult(result) {
    window.parent.postMessage({
      type: 'autopilot:action-result',
      sessionId: SESSION_ID,
      result: result,
    }, '*');
  }

  // ── postMessage Bridge ───────────────────────────────────────────────────

  window.addEventListener('message', function(e) {
    var msg = e.data;
    if (!msg || msg.sessionId !== SESSION_ID) return;

    if (msg.type === 'autopilot:start') {
      createTutorUI();
      setThinking(true);
      window.parent.postMessage({ type: 'autopilot:ready', sessionId: SESSION_ID }, '*');
      return;
    }

    if (msg.type === 'autopilot:get-state') {
      var state = getVisualizationState();
      window.parent.postMessage({
        type: 'autopilot:state',
        sessionId: SESSION_ID,
        state: state,
      }, '*');
      return;
    }

    if (msg.type === 'autopilot:execute') {
      setThinking(false);
      executeAction(msg.action);
      return;
    }

    if (msg.type === 'autopilot:stop') {
      if (panel) panel.remove();
      return;
    }
  });

})();
`.trim();
}
