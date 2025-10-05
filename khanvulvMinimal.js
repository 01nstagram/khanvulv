(function() {
    // Evita a reinjeção do script
    if (document.getElementById("narcotizes-panel")) return;
    
    // Configurações e estado das funcionalidades
    const features = {
        autoAnswer: false,
        revealAnswers: false,
        questionSpoof: false,
        videoSpoof: false,
        darkMode: true,
        rgbLogo: false
    };

    const config = {
        autoAnswerDelay: 1.5
    };

    // Função para exibir notificações (toasts)
    function showToast(message, type = "info", duration = 3000) {
        const toast = document.createElement("div");
        toast.className = `narcotizes-toast narcotizes-toast-${type}`;
        toast.innerHTML = `
            <div class="narcotizes-toast-icon">${type === "success" ? "✓" : type === "error" ? "✗" : "•"}</div>
            <div class="narcotizes-toast-message">${message}</div>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(20px)";
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // Função de utilidade para criar pausas
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Injeta o CSS do painel e do tema na página
    const style = document.createElement("style");
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        :root {
            /* Tema Preto e Branco - Narcotizes Dev */
            --narcotizes-bg: #101010;
            --narcotizes-surface: #181818;
            --narcotizes-border: #282828;
            --narcotizes-primary: #FFFFFF;
            --narcotizes-primary-light: #CCCCCC;
            --narcotizes-accent: #888888;
            --narcotizes-text: #E0E0E0;
            --narcotizes-text-muted: #777777;
            --narcotizes-success: #CCCCCC;
            --narcotizes-error: #ff6b6b;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.2); }
            70% { transform: scale(1.02); box-shadow: 0 0 0 12px rgba(255, 255, 255, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
        
        @keyframes orbit {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes shine {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
                transition-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
            }
            0% { transform: translateY(0) scale(1); }
            20% { transform: translateY(-15px) scale(1.05); }
            53% { transform: translateY(-7px) scale(1.02); }
            80% { transform: translateY(0) scale(1.01); }
            100% { transform: translateY(0) scale(1); }
        }
        
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
        }
        
        .narcotizes-splash {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #000000, #151515);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            color: white;
            font-family: 'Inter', sans-serif;
            transition: opacity 0.5s;
            overflow: hidden;
        }
        
        .narcotizes-splash::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05), transparent 30%),
                        radial-gradient(circle at 80% 70%, rgba(204, 204, 204, 0.03), transparent 30%);
            z-index: 0;
        }
        
        .narcotizes-splash::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                radial-gradient(1px 1px at 20px 20px, #5a5a7a 1px, transparent 1px);
            background-size: 40px 40px;
            opacity: 0.1;
            z-index: 1;
        }
        
        .narcotizes-splash-content {
            position: relative;
            z-index: 2;
            text-align: center;
        }
        
        .narcotizes-splash-title {
            font-size: 42px;
            font-weight: 700;
            margin-bottom: 12px;
            background: linear-gradient(to right, #FFFFFF, #AAAAAA);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
        }
        
        .narcotizes-splash-subtitle {
            font-size: 18px;
            color: var(--narcotizes-text-muted);
            margin-bottom: 30px;
            font-weight: 400;
        }
        
        .narcotizes-splash-loader {
            width: 60px;
            height: 60px;
            position: relative;
        }
        
        .narcotizes-splash-loader-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 2px solid transparent;
            border-top-color: var(--narcotizes-primary);
            border-radius: 50%;
            animation: orbit 1.5s linear infinite;
        }
        
        .narcotizes-splash-loader-ring:nth-child(2) {
            border-top-color: var(--narcotizes-accent);
            animation-duration: 2.5s;
            transform: rotate(60deg);
        }
        
        .narcotizes-splash-loader-ring:nth-child(3) {
            border-top-color: rgba(255, 255, 255, 0.5);
            animation-duration: 3.5s;
            transform: rotate(120deg);
        }
        
        .narcotizes-splash-status {
            margin-top: 25px;
            font-size: 14px;
            color: var(--narcotizes-text-muted);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .narcotizes-splash-status-dot {
            width: 8px;
            height: 8px;
            background: var(--narcotizes-primary);
            border-radius: 50%;
            animation: pulse 1.5s infinite;
        }
        
        .narcotizes-splash.fadeout {
            animation: fadeOut 0.5s forwards;
        }
        
        @keyframes fadeOut {
            to { opacity: 0; pointer-events: none; }
        }
        
        .narcotizes-toast {
            position: fixed;
            bottom: 24px;
            right: 24px;
            max-width: 320px;
            width: calc(100vw - 48px);
            background: var(--narcotizes-surface);
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            font-family: 'Inter', sans-serif;
            z-index: 999999;
            transition: all 0.3s ease;
            opacity: 1;
            transform: translateY(0);
            border-left: 3px solid var(--narcotizes-primary);
        }
        
        .narcotizes-toast-success {
            border-left-color: var(--narcotizes-success);
        }
        
        .narcotizes-toast-error {
            border-left-color: var(--narcotizes-error);
        }
        
        .narcotizes-toast-icon {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        .narcotizes-toast-message {
            font-size: 14px;
            color: var(--narcotizes-text);
            flex: 1;
        }
        
        .narcotizes-toggle {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, var(--narcotizes-primary), var(--narcotizes-primary-light));
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 100000;
            color: #101010;
            font-size: 28px;
            box-shadow: 0 6px 16px rgba(204, 204, 204, 0.2);
            font-family: 'Inter', sans-serif;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 99999;
            overflow: hidden;
            transform: scale(1);
        }
        
        .narcotizes-toggle:hover {
            transform: scale(1.08) translateY(-3px);
            box-shadow: 0 10px 24px rgba(204, 204, 204, 0.3);
        }
        
        .narcotizes-toggle:active {
            transform: scale(1) translateY(0);
            box-shadow: 0 4px 12px rgba(204, 204, 204, 0.2);
        }
        
        .narcotizes-toggle.bounce {
            animation: bounce 0.5s;
        }
        
        .narcotizes-toggle.float {
            animation: float 3s ease-in-out infinite;
        }
        
        .narcotizes-panel {
            position: fixed;
            top: 120px;
            right: 40px;
            width: 360px;
            max-height: 75vh;
            background: var(--narcotizes-bg);
            border-radius: 16px;
            border: 1px solid var(--narcotizes-border);
            z-index: 99999;
            color: var(--narcotizes-text);
            font-family: 'Inter', sans-serif;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
            display: none;
            overflow: hidden;
            transform: translateY(10px);
            opacity: 0;
            transition: all 0.3s ease;
            cursor: default;
        }
        
        .narcotizes-panel.active {
            transform: translateY(0);
            opacity: 1;
        }
        
        .narcotizes-header {
            padding: 20px 24px 16px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        
        .narcotizes-title {
            font-weight: 700;
            font-size: 20px;
            background: linear-gradient(to right, #FFFFFF, #CCCCCC);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            letter-spacing: -0.5px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .narcotizes-title-icon {
            font-size: 22px;
        }
        
        .narcotizes-version {
            font-size: 13px;
            color: var(--narcotizes-text-muted);
            background: rgba(40, 40, 40, 0.5);
            padding: 3px 8px;
            border-radius: 6px;
            font-weight: 500;
        }
        
        .narcotizes-tabs {
            display: flex;
            padding: 0 8px;
            margin: 0 16px;
            border-radius: 10px;
            background: var(--narcotizes-surface);
            overflow: hidden;
            border: 1px solid var(--narcotizes-border);
        }
        
        .narcotizes-tab {
            flex: 1;
            padding: 14px 0;
            cursor: pointer;
            color: var(--narcotizes-text-muted);
            font-weight: 500;
            font-size: 14px;
            text-align: center;
            transition: all 0.2s ease;
            position: relative;
        }
        
        .narcotizes-tab:hover {
            color: var(--narcotizes-primary-light);
        }
        
        .narcotizes-tab.active {
            color: white;
            font-weight: 600;
        }
        
        .narcotizes-tab.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 3px;
            background: var(--narcotizes-primary);
            border-radius: 3px;
        }
        
        .narcotizes-tab-content {
            padding: 16px;
            display: none;
            max-height: 480px;
            overflow-y: auto;
        }
        
        .narcotizes-tab-content.active {
            display: block;
            animation: fadeIn 0.2s ease;
        }
        
        /* Custom scrollbar */
        .narcotizes-tab-content::-webkit-scrollbar {
            width: 6px;
        }
        
        .narcotizes-tab-content::-webkit-scrollbar-track {
            background: rgba(40, 40, 40, 0.3);
            border-radius: 3px;
        }
        
        .narcotizes-tab-content::-webkit-scrollbar-thumb {
            background: var(--narcotizes-primary);
            border-radius: 3px;
        }
        
        .narcotizes-button {
            width: 100%;
            padding: 16px;
            background: var(--narcotizes-surface);
            color: var(--narcotizes-text);
            border: 1px solid var(--narcotizes-border);
            border-radius: 12px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            text-align: left;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 14px;
            transition: all 0.25s ease;
            position: relative;
            overflow: hidden;
        }
        
        .narcotizes-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
            transition: all 0.6s ease;
        }
        
        .narcotizes-button:hover::before {
            left: 100%;
        }
        
        .narcotizes-button:hover {
            border-color: var(--narcotizes-primary);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(204, 204, 204, 0.08);
        }
        
        .narcotizes-button:active {
            transform: translateY(0);
        }
        
        .narcotizes-button.active {
            background: rgba(255, 255, 255, 0.1);
            border-color: var(--narcotizes-primary);
            color: white;
        }
        
        .narcotizes-button.active::after {
            content: 'ATIVADO';
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.15);
            color: var(--narcotizes-primary-light);
            font-size: 12px;
            padding: 3px 10px;
            border-radius: 12px;
            font-weight: 600;
        }
        
        .narcotizes-icon {
            width: 26px;
            height: 26px;
            min-width: 26px;
            background: rgba(40, 40, 40, 0.3);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: all 0.25s ease;
        }
        
        .narcotizes-button:hover .narcotizes-icon {
            background: var(--narcotizes-primary);
            color: #101010;
            transform: scale(1.05);
        }
        
        .narcotizes-button.active .narcotizes-icon {
            background: var(--narcotizes-primary);
            color: #101010;
        }
        
        .narcotizes-input-group {
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid var(--narcotizes-border);
        }
        
        .narcotizes-input-label {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: var(--narcotizes-text-muted);
            margin-bottom: 10px;
            font-weight: 500;
        }
        
        .narcotizes-speed-value {
            font-weight: 600;
            color: var(--narcotizes-primary);
        }
        
        .narcotizes-range-container {
            position: relative;
            height: 50px;
            display: flex;
            align-items: center;
            margin-top: 8px;
        }
        
        .narcotizes-range {
            width: 100%;
            height: 6px;
            -webkit-appearance: none;
            appearance: none;
            background: var(--narcotizes-surface);
            border-radius: 3px;
            position: relative;
            cursor: pointer;
        }
        
        .narcotizes-range:focus {
            outline: none;
        }
        
        .narcotizes-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: var(--narcotizes-bg);
            border: 2px solid var(--narcotizes-primary);
            cursor: pointer;
            transition: all 0.15s ease;
            margin-top: -9px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            z-index: 2;
        }
        
        .narcotizes-range::-webkit-slider-thumb:hover,
        .narcotizes-range::-webkit-slider-thumb:active {
            transform: scale(1.25);
            background: var(--narcotizes-primary);
            border-color: white;
            box-shadow: 0 0 0 8px rgba(255, 255, 255, 0.15);
        }
        
        .narcotizes-range-track {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            border-radius: 3px;
            background: linear-gradient(90deg, var(--narcotizes-primary), var(--narcotizes-accent));
        }
        
        .narcotizes-range-marks {
            display: flex;
            justify-content: space-between;
            position: absolute;
            width: 100%;
            top: 12px;
            pointer-events: none;
        }
        
        .narcotizes-range-mark {
            width: 2px;
            height: 8px;
            background: var(--narcotizes-text-muted);
            border-radius: 1px;
        }
        
        .narcotizes-range-mark.active {
            height: 12px;
            background: var(--narcotizes-primary);
        }
        
        .narcotizes-range-labels {
            display: flex;
            justify-content: space-between;
            position: absolute;
            width: 100%;
            top: 28px;
            font-size: 12px;
            color: var(--narcotizes-text-muted);
            pointer-events: none;
        }
        
        .narcotizes-footer {
            padding: 16px;
            border-top: 1px solid var(--narcotizes-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: var(--narcotizes-text-muted);
            background: rgba(24, 24, 24, 0.7);
        }
        
        .narcotizes-footer a {
            color: var(--narcotizes-primary);
            text-decoration: none;
            transition: color 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .narcotizes-footer a:hover {
            color: var(--narcotizes-primary-light);
        }
        
        .narcotizes-about-content {
            padding: 8px 0;
        }
        
        .narcotizes-about-content p {
            color: var(--narcotizes-text-muted);
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        
        .narcotizes-features {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 16px 0;
        }
        
        @media (max-width: 400px) {
            .narcotizes-features {
                grid-template-columns: 1fr;
            }
        }
        
        .narcotizes-feature {
            background: var(--narcotizes-surface);
            border: 1px solid var(--narcotizes-border);
            border-radius: 10px;
            padding: 14px;
            font-size: 13px;
            transition: all 0.2s ease;
        }
        
        .narcotizes-feature:hover {
            transform: translateY(-2px);
            border-color: var(--narcotizes-primary);
            box-shadow: 0 4px 12px rgba(204, 204, 204, 0.08);
        }
        
        .narcotizes-feature-title {
            font-weight: 600;
            color: var(--narcotizes-primary);
            margin-bottom: 4px;
            font-size: 14px;
        }
        
        .narcotizes-social-links {
            display: flex;
            gap: 16px;
            margin-top: 16px;
        }
        
        .narcotizes-social-btn {
            flex: 1;
            padding: 12px;
            background: var(--narcotizes-surface);
            border: 1px solid var(--narcotizes-border);
            border-radius: 10px;
            color: var(--narcotizes-text);
            text-decoration: none;
            text-align: center;
            font-size: 14px;
            transition: all 0.2s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
        }
        
        .narcotizes-social-btn:hover {
            border-color: var(--narcotizes-primary);
            background: rgba(255, 255, 255, 0.05);
        }
        
        .narcotizes-social-icon {
            font-size: 18px;
        }
        
        .narcotizes-credits {
            font-size: 13px;
            color: var(--narcotizes-text-muted);
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid var(--narcotizes-border);
            line-height: 1.5;
        }
        
        .narcotizes-credits a {
            color: var(--narcotizes-primary);
            text-decoration: none;
        }
        
        .narcotizes-credits a:hover {
            text-decoration: underline;
        }
        
        /* Estilos para dispositivos móveis */
        @media (max-width: 768px) {
            .narcotizes-panel {
                width: calc(100vw - 48px);
                top: auto;
                bottom: 90px;
                right: 24px;
                max-height: 70vh;
            }
            
            .narcotizes-toggle {
                bottom: 24px;
                right: 24px;
                width: 60px;
                height: 60px;
            }
            
            .narcotizes-toast {
                max-width: calc(100vw - 48px);
                bottom: 24px;
                right: 24px;
                left: auto;
            }
            
            .narcotizes-tabs {
                margin: 0 12px;
            }
        }
    `;
    document.head.appendChild(style);

    // Intercepta respostas da API para revelar as corretas
    const originalParse = JSON.parse;
    JSON.parse = function(text, reviver) {
        let data = originalParse(text, reviver);
        if (features.revealAnswers && data && data.data) {
            try {
                const dataValues = Object.values(data.data);
                for (const val of dataValues) {
                    if (val && val.item && val.item.itemData) {
                        let itemData = JSON.parse(val.item.itemData);
                        if (itemData.question && itemData.question.widgets) {
                            for (const widget of Object.values(itemData.question.widgets)) {
                                if (widget.options && widget.options.choices) {
                                    widget.options.choices.forEach(choice => {
                                        if (choice.correct) {
                                            choice.content = "✅ " + choice.content;
                                        }
                                    });
                                }
                            }
                        }
                        val.item.itemData = JSON.stringify(itemData);
                    }
                }
                showToast("Respostas reveladas com sucesso", "success", 2000);
            } catch (e) {}
        }
        return data;
    };

    // Intercepta requisições de questões para modificá-las
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        let [input, init] = args;
        const originalResponse = await originalFetch.apply(this, args);
        if (features.questionSpoof && originalResponse.ok) {
            const clonedResponse = originalResponse.clone();
            try {
                let responseObj = await clonedResponse.json();
                if (responseObj && responseObj.data && responseObj.data.assessmentItem && responseObj.data.assessmentItem.item && responseObj.data.assessmentItem.item.itemData) {
                    const phrases = [
                        "🚀 Feito por [@NarcotizesDev](https://github.com/NarcotizesDev)",
                        "💫 Créditos para [@NarcotizesDev](https://github.com/NarcotizesDev)",
                        "🔭 Acesse o GitHub do [@NarcotizesDev](https://github.com/NarcotizesDev)",
                        "🌌 Entre no nosso Discord: [Narcotizes](https://discord.gg/your-invite)",
                        "🌠 Narcotizes sempre em frente"
                    ];
                    let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                    itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `\n\n[[☃ radio 1]]`;
                    itemData.question.widgets = { 
                        "radio 1": { 
                            type: "radio", 
                            options: { 
                                choices: [
                                    { content: "✅ Correto", correct: true }, 
                                    { content: "❌ Errado (nao clique aqui animal)", correct: false }
                                ] 
                            } 
                        } 
                    };
                    responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                    showToast("Questão modificada com sucesso", "success", 2000);
                    return new Response(JSON.stringify(responseObj), { 
                        status: 200, 
                        statusText: "OK", 
                        headers: originalResponse.headers 
                    });
                }
            } catch (e) {}
        }
        return originalResponse;
    };

    // Loop para exibir FPS
    let lastFrameTime = performance.now();
    let frameCount = 0;
    function gameLoop() {
        const now = performance.now();
        frameCount++;
        if (now - lastFrameTime >= 1000) {
            const fpsCounter = document.getElementById("narcotizes-fps");
            if (fpsCounter) fpsCounter.textContent = `✨ ${frameCount}`;
            frameCount = 0;
            lastFrameTime = now;
        }
        requestAnimationFrame(gameLoop);
    }

    // Loop principal para resposta automática
    (async function autoAnswerLoop() {
        while (true) {
            if (features.autoAnswer) {
                const click = (selector) => { 
                    const e = document.querySelector(selector); 
                    if(e) e.click(); 
                };
                click('[data-testid="choice-icon__library-choice-icon"]');
                await delay(100);
                click('[data-testid="exercise-check-answer"]');
                await delay(100);
                click('[data-testid="exercise-next-question"]');
            }
            await delay(config.autoAnswerDelay * 1000);
        }
    })();

    // Inicializa a interface do usuário
    (async function initializeUI() {
        // Cria a tela de splash animada
        const splash = document.createElement("div");
        splash.className = "narcotizes-splash";
        splash.innerHTML = `
            <div class="narcotizes-splash-content">
                <div class="narcotizes-splash-title">Narcotizes Dev</div>
                <div class="narcotizes-splash-subtitle">Carregando sistema de automação</div>
                <div class="narcotizes-splash-loader">
                    <div class="narcotizes-splash-loader-ring"></div>
                    <div class="narcotizes-splash-loader-ring"></div>
                    <div class="narcotizes-splash-loader-ring"></div>
                </div>
                <div class="narcotizes-splash-status">
                    <div class="narcotizes-splash-status-dot"></div>
                    <div>Sistema inicializado</div>
                </div>
            </div>
        `;
        document.body.appendChild(splash);

        // Carrega a biblioteca Dark Reader para o modo escuro
        function loadScript(src, id) {
            return new Promise((resolve, reject) => {
                if (document.getElementById(id)) return resolve();
                const script = document.createElement('script');
                script.src = src; 
                script.id = id;
                script.onload = resolve; 
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkreader').then(() => {
            DarkReader.setFetchMethod(window.fetch);
            if (features.darkMode) DarkReader.enable();
        });

        // Simula um tempo de carregamento
        await delay(1800);
        
        // Remove a tela de splash com uma transição suave
        splash.classList.add("fadeout");
        await delay(500);

        // Cria o botão flutuante para abrir o menu
        const toggleBtn = document.createElement("div");
        toggleBtn.className = "narcotizes-toggle float";
        toggleBtn.innerHTML = "☰";
        
        toggleBtn.onclick = () => {
            const p = document.getElementById("narcotizes-panel");
            if (p) {
                if (p.style.display === "block") {
                    p.style.display = "none";
                    toggleBtn.classList.remove('active');
                    toggleBtn.classList.remove('float');
                } else {
                    p.style.display = "block";
                    setTimeout(() => {
                        p.classList.add("active");
                        toggleBtn.classList.add('active');
                        toggleBtn.classList.add('float');
                    }, 10);
                }
            }
        };
        
        document.body.appendChild(toggleBtn);
        
        // Cria o painel principal com todas as opções
        const panel = document.createElement("div");
        panel.id = "narcotizes-panel";
        panel.className = "narcotizes-panel";
        panel.innerHTML = `
            <div class="narcotizes-header">
                <div class="narcotizes-title">
                    <span class="narcotizes-title-icon">⚙️</span>
                    Narcotizes Dev
                </div>
                <div class="narcotizes-version">v2.1</div>
            </div>
            <div class="narcotizes-tabs">
                <div class="narcotizes-tab active" data-tab="main">Principal</div>
                <div class="narcotizes-tab" data-tab="visual">Visual</div>
                <div class="narcotizes-tab" data-tab="about">Sobre</div>
            </div>
            <div id="narcotizes-tab-main" class="narcotizes-tab-content active">
                <button id="narcotizes-btn-auto" class="narcotizes-button">
                    <span class="narcotizes-icon">⚡</span>
                    <span>Resposta Automática</span>
                </button>
                <button id="narcotizes-btn-reveal" class="narcotizes-button">
                    <span class="narcotizes-icon">🔍</span>
                    <span>Revelar Respostas</span>
                </button>
                <button id="narcotizes-btn-question" class="narcotizes-button">
                    <span class="narcotizes-icon">📝</span>
                    <span>Modificar Questões</span>
                </button>
                <button id="narcotizes-btn-video" class="narcotizes-button">
                    <span class="narcotizes-icon">▶️</span>
                    <span>Modificar Vídeos</span>
                </button>
                
                <div class="narcotizes-input-group">
                    <div class="narcotizes-input-label">
                        <span>Velocidade de Resposta</span>
                        <span class="narcotizes-speed-value">${config.autoAnswerDelay.toFixed(1)}s</span>
                    </div>
                    <div class="narcotizes-range-container">
                        <input type="range" class="narcotizes-range" id="narcotizes-speed" value="${config.autoAnswerDelay}" min="1.5" max="2.5" step="0.1">
                        <div class="narcotizes-range-track" style="width: ${((config.autoAnswerDelay - 1.5) / 1.0) * 100}%"></div>
                        <div class="narcotizes-range-marks">
                            <div class="narcotizes-range-mark ${config.autoAnswerDelay <= 1.7 ? 'active' : ''}"></div>
                            <div class="narcotizes-range-mark ${config.autoAnswerDelay > 1.7 && config.autoAnswerDelay <= 1.9 ? 'active' : ''}"></div>
                            <div class="narcotizes-range-mark ${config.autoAnswerDelay > 1.9 && config.autoAnswerDelay <= 2.1 ? 'active' : ''}"></div>
                            <div class="narcotizes-range-mark ${config.autoAnswerDelay > 2.1 && config.autoAnswerDelay <= 2.3 ? 'active' : ''}"></div>
                            <div class="narcotizes-range-mark ${config.autoAnswerDelay > 2.3 ? 'active' : ''}"></div>
                        </div>
                        <div class="narcotizes-range-labels">
                            <div>Lenta</div>
                            <div>Normal</div>
                            <div>Rápida</div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="narcotizes-tab-visual" class="narcotizes-tab-content">
                <button id="narcotizes-btn-dark" class="narcotizes-button active">
                    <span class="narcotizes-icon">🌓</span>
                    <span>Modo Escuro</span>
                </button>
                <button id="narcotizes-btn-rgb" class="narcotizes-button">
                    <span class="narcotizes-icon">🎨</span>
                    <span>Logo RGB Dinâmico</span>
                </button>
            </div>
            <div id="narcotizes-tab-about" class="narcotizes-tab-content">
                <div class="narcotizes-about-content">
                    <p>Um sistema avançado de automação e personalização para Khan Academy, projetado para melhorar sua experiência de aprendizado com recursos inteligentes e interface intuitiva.</p>
                    
                    <div class="narcotizes-features">
                        <div class="narcotizes-feature">
                            <div class="narcotizes-feature-title">Automação Inteligente</div>
                            <div>Respostas automáticas com controle de velocidade ajustável</div>
                        </div>
                        <div class="narcotizes-feature">
                            <div class="narcotizes-feature-title">Segurança Acadêmica</div>
                            <div>Revelação discreta de respostas e modificação de conteúdo</div>
                        </div>
                        <div class="narcotizes-feature">
                            <div class="narcotizes-feature-title">Personalização Completa</div>
                            <div>Adapte a interface ao seu estilo de aprendizado</div>
                        </div>
                        <div class="narcotizes-feature">
                            <div class="narcotizes-feature-title">Desempenho Otimizado</div>
                            <div>Funciona suavemente sem afetar a performance</div>
                        </div>
                    </div>
                    
                    <div class="narcotizes-social-links">
                        <a href="https://discord.gg/your-invite" target="_blank" class="narcotizes-social-btn">
                            <span class="narcotizes-social-icon">💬</span>
                            <span>Discord</span>
                        </a>
                        <a href="https://github.com/NarcotizesDev" target="_blank" class="narcotizes-social-btn">
                            <span class="narcotizes-social-icon">🐙</span>
                            <span>GitHub</span>
                        </a>
                    </div>
                    
                    <div class="narcotizes-credits">
                        Desenvolvido com ❤ por <a href="https://github.com/NarcotizesDev" target="_blank">@NarcotizesDev</a><br>
                        Narcotizes Dev • Sempre à frente da curva
                    </div>
                </div>
            </div>
            <div class="narcotizes-footer">
                <a href="https://discord.gg/your-invite" target="_blank">
                    <span>Comunidade Narcotizes</span>
                </a>
                <span id="narcotizes-fps">✨ ...</span>
            </div>
        `;
        document.body.appendChild(panel);

        // Configura os botões de toggle para as funcionalidades
        const setupToggleButton = (buttonId, featureName, callback) => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', () => {
                    features[featureName] = !features[featureName];
                    button.classList.toggle('active', features[featureName]);
                    
                    if (callback) callback(features[featureName]);
                    
                    const action = features[featureName] ? "ativado" : "desativado";
                    const featureText = button.querySelector('span:last-child').textContent;
                    showToast(`${featureText} ${action}`, 
                             features[featureName] ? "success" : "info");
                });
            }
        };
        
        setupToggleButton('narcotizes-btn-auto', 'autoAnswer');
        setupToggleButton('narcotizes-btn-question', 'questionSpoof');
        setupToggleButton('narcotizes-btn-video', 'videoSpoof');
        setupToggleButton('narcotizes-btn-reveal', 'revealAnswers');
        setupToggleButton('narcotizes-btn-dark', 'darkMode', (isActive) => {
            if (typeof DarkReader === 'undefined') return;
            isActive ? DarkReader.enable() : DarkReader.disable();
        });
        setupToggleButton('narcotizes-btn-rgb', 'rgbLogo', toggleRgbLogo);

        // Configura o controle deslizante de velocidade
        const speedInput = document.getElementById('narcotizes-speed');
        const speedValue = document.querySelector('.narcotizes-speed-value');
        const rangeTrack = document.querySelector('.narcotizes-range-track');
        const rangeMarks = document.querySelectorAll('.narcotizes-range-mark');
        
        if (speedInput && speedValue && rangeTrack) {
            const updateSpeedUI = () => {
                const value = parseFloat(speedInput.value);
                const percent = ((value - 1.5) / 1.0) * 100;
                
                speedValue.textContent = `${value.toFixed(1)}s`;
                rangeTrack.style.width = `${percent}%`;
                
                rangeMarks.forEach((mark, index) => {
                    const markValue = 1.5 + (index * 0.25);
                    mark.classList.toggle('active', value >= markValue);
                });
            };
            
            updateSpeedUI();
            speedInput.addEventListener('input', updateSpeedUI);
            speedInput.addEventListener('change', () => {
                config.autoAnswerDelay = parseFloat(speedInput.value);
                showToast(`Velocidade definida para ${config.autoAnswerDelay.toFixed(1)}s`, "info", 1500);
            });
        }
        
        // Configura a navegação por abas
        document.querySelectorAll('.narcotizes-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.narcotizes-tab, .narcotizes-tab-content').forEach(el => el.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(`narcotizes-tab-${tab.dataset.tab}`).classList.add('active');
            });
        });

        // Funções de callback para funcionalidades específicas
        function toggleRgbLogo(isActive) {
            const khanLogo = document.querySelector('path[fill="#14bf96"]');
            if (!khanLogo) {
                showToast("Logo do Khan Academy não encontrada", "error");
                return;
            }
            khanLogo.style.animation = isActive ? 'hueShift 5s infinite linear' : '';
        }
        
        // Implementa a funcionalidade de arrastar o painel
        let isDragging = false;
        let panelOffset = { x: 0, y: 0 };
        let lastDragTime = 0;
        
        function startDragging(e) {
            if (e.target.closest('button, input, a, .narcotizes-tab, .narcotizes-range')) return;
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            panelOffset = {
                x: e.clientX - rect.right,
                y: e.clientY - rect.top
            };
            panel.style.cursor = "grabbing";
            panel.style.transition = "none";
            toggleBtn.style.transition = "none";
            toggleBtn.classList.remove('float');
            lastDragTime = Date.now();
        }
        
        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            const newX = window.innerWidth - e.clientX + panelOffset.x;
            const newY = e.clientY - panelOffset.y;
            const maxX = window.innerWidth - 50;
            const maxY = window.innerHeight - 50;
            panel.style.right = Math.min(newX, maxX) + "px";
            panel.style.top = Math.max(80, Math.min(newY, maxY)) + "px";
        }
        
        function stopDragging() {
            isDragging = false;
            panel.style.cursor = "default";
            panel.style.transition = "transform 0.3s ease";
            toggleBtn.style.transition = "all 0.3s ease";
            const dragDuration = Date.now() - lastDragTime;
            if (dragDuration < 300) {
                toggleBtn.classList.add('bounce');
                setTimeout(() => {
                    toggleBtn.classList.remove('bounce');
                    toggleBtn.classList.add('float');
                }, 500);
            } else {
                toggleBtn.classList.add('float');
            }
        }
        
        // Adiciona listeners para eventos de mouse e toque
        panel.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);
        panel.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startDragging(new MouseEvent('mousedown', { clientX: touch.clientX, clientY: touch.clientY }));
            e.preventDefault();
        }, { passive: false });
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            drag(new MouseEvent('mousemove', { clientX: touch.clientX, clientY: touch.clientY }));
            e.preventDefault();
        }, { passive: false });
        document.addEventListener('touchend', stopDragging);
        
        // Inicia o loop para o contador de FPS
        gameLoop();
    })();
})();
