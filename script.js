document.addEventListener('DOMContentLoaded', () => {
    // Año actual automático en el pie de página
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.innerText = new Date().getFullYear();
    }

    // Menú adaptable para celulares
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }

    // Motor de evaluación de fórmulas en lenguaje natural (idéntico al de StockGenio)
    function evaluateNaturalFormula(rawInput) {
        if (!rawInput) return 0;
        let expr = String(rawInput).toLowerCase()
            .replace(/^=/, '')
            .replace(/\$/g, '')
            .replace(/\.(?=\d{3}(\D|$))/g, '')
            .replace(/,/g, '.')
            .replace(/\bm[aá]s\b/g, '+')
            .replace(/\bmenos\b/g, '-')
            .replace(/\b(por|x)\b/g, '*')
            .replace(/\b(dividido|entre)\b/g, '/')
            .trim();

        if (/^[0-9+\-*/.()\s]+$/.test(expr) && /[0-9]/.test(expr)) {
            try {
                const result = Function('"use strict"; return (' + expr + ')')();
                if (typeof result === 'number' && isFinite(result)) {
                    return Math.round(result * 100) / 100;
                }
            } catch (e) {
                const nums = expr.match(/[+-]?\s*\d+(\.\d+)?/g);
                if (nums) {
                    return nums.reduce((acc, n) => acc + parseFloat(n.replace(/\s+/g, '')), 0);
                }
            }
        }
        const parsed = parseFloat(expr);
        return isNaN(parsed) ? 0 : parsed;
    }

    // Elementos del Simulador en Vivo
    const simComprada = document.getElementById('simComprada');
    const simVendida = document.getElementById('simVendida');
    const simPrecioLista = document.getElementById('simPrecioLista');
    const simPorcentaje = document.getElementById('simPorcentaje');

    const resComprada = document.getElementById('resComprada');
    const resVendida = document.getElementById('resVendida');
    const resLista = document.getElementById('resLista');
    const simStockFinal = document.getElementById('simStockFinal');
    const simEfectivoFinal = document.getElementById('simEfectivoFinal');
    const simResultBox = document.getElementById('simResultBox');
    const simStockAlert = document.getElementById('simStockAlert');

    function updateSimulator() {
        const compVal = evaluateNaturalFormula(simComprada.value);
        const vendVal = evaluateNaturalFormula(simVendida.value);
        const listaVal = evaluateNaturalFormula(simPrecioLista.value);
        const pctVal = parseFloat(simPorcentaje.value) || 80;

        const stock = Math.round((compVal - vendVal) * 100) / 100;
        const efectivo = Math.round((listaVal * (pctVal / 100)) * 100) / 100;

        resComprada.innerText = compVal.toLocaleString('es-AR');
        resVendida.innerText = vendVal.toLocaleString('es-AR');
        resLista.innerText = `$${listaVal.toLocaleString('es-AR')}`;

        simStockFinal.innerText = `${stock.toLocaleString('es-AR')} unidades`;
        simEfectivoFinal.innerText = `$${efectivo.toLocaleString('es-AR')}`;

        if (stock <= 0) {
            simResultBox.classList.add('out-of-stock');
            simStockAlert.classList.remove('hidden');
        } else {
            simResultBox.classList.remove('out-of-stock');
            simStockAlert.classList.add('hidden');
        }
    }

    [simComprada, simVendida, simPrecioLista, simPorcentaje].forEach(input => {
        if (input) input.addEventListener('input', updateSimulator);
    });

    updateSimulator();

    // Copiado rápido de usuario de Discord / enlaces con notificación Toast
    const copyButtons = document.querySelectorAll('.copy-btn');
    const toast = document.getElementById('toast');
    let toastTimer = null;

    function showToast(msg) {
        if (!toast) return;
        toast.innerText = msg;
        toast.classList.remove('hidden');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.add('hidden');
        }, 2500);
    }

    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.dataset.copy;
            if (!textToCopy) return;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast(`✅ Copiado: ${textToCopy}`);
                });
            } else {
                const tempInput = document.createElement('textarea');
                tempInput.value = textToCopy;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showToast(`✅ Copiado: ${textToCopy}`);
            }
        });
    });
});