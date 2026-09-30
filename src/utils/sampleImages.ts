// Utility to generate base64 sample notes images for immediate testing without external assets
export function generateSampleNotesImage(type: 'calculus' | 'tree' | 'circuits'): { dataUrl: string; mimeType: string } {
  if (typeof document === 'undefined') {
    return { dataUrl: '', mimeType: 'image/png' };
  }

  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { dataUrl: '', mimeType: 'image/png' };

  // Background: Yellowish lined notebook paper
  ctx.fillStyle = '#fefdfa';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Left red margin line
  ctx.strokeStyle = '#fca5a5';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 0);
  ctx.lineTo(80, canvas.height);
  ctx.stroke();

  // Horizontal blue ruling lines
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  for (let y = 50; y < canvas.height; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Draw handwritten style content based on type
  ctx.font = 'bold 20px "JetBrains Mono", cursive, sans-serif';
  ctx.fillStyle = '#1e3a8a'; // Dark ink pen

  if (type === 'calculus') {
    ctx.fillText('Topic: Integration by Parts Formula & Derivation', 95, 45);
    ctx.font = '17px "JetBrains Mono", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('Formula: ∫ u dv = u·v - ∫ v du', 95, 80);
    ctx.fillText('Problem: Evaluate  I = ∫ x · e^(2x) dx', 95, 115);

    ctx.fillStyle = '#047857';
    ctx.fillText('Step 1: Choose u and dv using LIATE rule:', 95, 150);
    ctx.fillStyle = '#1e293b';
    ctx.fillText('  Let u = x       ==>  du = dx', 95, 182);
    ctx.fillText('  Let dv = e^(2x) dx ==>  v = (1/2) e^(2x)', 95, 214);

    ctx.fillStyle = '#047857';
    ctx.fillText('Step 2: Apply Integration by Parts formula:', 95, 250);
    ctx.fillStyle = '#1e293b';
    ctx.fillText('  I = x · (1/2 e^(2x)) - ∫ (1/2 e^(2x)) dx', 95, 282);
    ctx.fillText('  I = (1/2) x e^(2x) - (1/2) · (1/2 e^(2x)) + C', 95, 314);

    ctx.fillStyle = '#b91c1c';
    ctx.fillText('Final Answer:', 95, 360);
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(95, 375, 460, 48);
    ctx.fillStyle = '#991b1b';
    ctx.font = 'bold 18px "JetBrains Mono", sans-serif';
    ctx.fillText('I = (1/2) x e^(2x) - (1/4) e^(2x) + C', 110, 407);
  } else if (type === 'tree') {
    ctx.fillText('Topic: AVL Binary Search Tree - Balance Factor & LL Rotation', 95, 45);
    ctx.font = '16px "JetBrains Mono", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('Rule: Balance Factor BF(Node) = Height(Left) - Height(Right)', 95, 80);
    ctx.fillText('Condition for AVL: BF ∈ {-1, 0, 1}. If |BF| > 1 => Unbalanced!', 95, 115);

    // Draw Unbalanced Tree on left
    ctx.fillStyle = '#475569';
    ctx.fillText('Unbalanced State (Left-Left heavy):', 95, 155);

    // Node 30
    ctx.beginPath();
    ctx.arc(200, 200, 22, 0, 2 * Math.PI);
    ctx.fillStyle = '#fee2e2';
    ctx.fill();
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#991b1b';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('30', 190, 205);
    ctx.fillText('BF=+2', 230, 200);

    // Line 30 -> 20
    ctx.strokeStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(185, 215);
    ctx.lineTo(150, 260);
    ctx.stroke();

    // Node 20
    ctx.beginPath();
    ctx.arc(140, 275, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffedd5';
    ctx.fill();
    ctx.strokeStyle = '#ea580c';
    ctx.stroke();
    ctx.fillStyle = '#9a3412';
    ctx.fillText('20', 132, 280);
    ctx.fillText('BF=+1', 85, 280);

    // Line 20 -> 10
    ctx.strokeStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(125, 290);
    ctx.lineTo(95, 335);
    ctx.stroke();

    // Node 10
    ctx.beginPath();
    ctx.arc(85, 350, 18, 0, 2 * Math.PI);
    ctx.fillStyle = '#e0e7ff';
    ctx.fill();
    ctx.strokeStyle = '#4f46e5';
    ctx.stroke();
    ctx.fillStyle = '#3730a3';
    ctx.fillText('10', 78, 355);

    // Arrow to Balanced
    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('== Right Rotation ==> ', 280, 260);

    // Balanced Node 20
    ctx.beginPath();
    ctx.arc(580, 200, 22, 0, 2 * Math.PI);
    ctx.fillStyle = '#dcfce7';
    ctx.fill();
    ctx.strokeStyle = '#16a34a';
    ctx.stroke();
    ctx.fillStyle = '#15803d';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('20', 570, 205);
    ctx.fillText('BF=0 (Balanced)', 610, 205);

    // Lines to 10 and 30
    ctx.strokeStyle = '#16a34a';
    ctx.beginPath();
    ctx.moveTo(565, 215);
    ctx.lineTo(520, 265);
    ctx.moveTo(595, 215);
    ctx.lineTo(640, 265);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(510, 280, 18, 0, 2 * Math.PI);
    ctx.fillStyle = '#dcfce7';
    ctx.fill();
    ctx.stroke();
    ctx.fillText('10', 502, 285);

    ctx.beginPath();
    ctx.arc(650, 280, 18, 0, 2 * Math.PI);
    ctx.fillStyle = '#dcfce7';
    ctx.fill();
    ctx.stroke();
    ctx.fillText('30', 642, 285);

    ctx.font = '15px "JetBrains Mono", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('Result: Height reduced from 3 to 2. Time Complexity: O(log N)', 95, 420);
  } else {
    // circuits
    ctx.fillText('Topic: Kirchhoff\'s Laws (KCL & KVL) in DC Circuits', 95, 45);
    ctx.font = '16px "JetBrains Mono", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('1. KCL (Junction Rule):  ∑ I_in = ∑ I_out', 95, 80);
    ctx.fillText('2. KVL (Loop Rule):      ∑ V_rises = ∑ V_drops  (∑ ΔV = 0)', 95, 115);

    // Draw simple circuit diagram
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.strokeRect(120, 160, 420, 180);

    // Battery on left
    ctx.fillStyle = '#fefdfa';
    ctx.fillRect(110, 220, 20, 60);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(105, 235);
    ctx.lineTo(135, 235);
    ctx.moveTo(115, 260);
    ctx.lineTo(125, 260);
    ctx.stroke();
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('+  V1 = 12V  -', 140, 255);

    // Resistor R1 on top
    ctx.fillStyle = '#fefdfa';
    ctx.fillRect(280, 150, 100, 20);
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(280, 150, 100, 20);
    ctx.fillStyle = '#1e3a8a';
    ctx.fillText('R1 = 4 Ω', 300, 165);

    // Resistor R2 on right
    ctx.fillStyle = '#fefdfa';
    ctx.fillRect(530, 220, 20, 60);
    ctx.strokeStyle = '#2563eb';
    ctx.strokeRect(530, 220, 20, 60);
    ctx.fillStyle = '#1e3a8a';
    ctx.fillText('R2 = 2 Ω', 560, 255);

    // Calculations
    ctx.fillStyle = '#047857';
    ctx.font = '16px "JetBrains Mono", sans-serif';
    ctx.fillText('Loop Equation:  12V - I·(4Ω) - I·(2Ω) = 0', 95, 380);
    ctx.fillText('Current I = 12 / (4 + 2) = 12 / 6 = 2.0 Amperes (A)', 95, 415);
  }

  return {
    dataUrl: canvas.toDataURL('image/png'),
    mimeType: 'image/png',
  };
}
