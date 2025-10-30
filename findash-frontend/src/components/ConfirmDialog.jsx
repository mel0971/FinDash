import { AlertCircle } from 'lucide-react';

export default function ConfirmDialog({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'OK', 
  cancelText = 'Annuler', 
  isDangerous = false,
  hasInput = false,
  inputValue = '',
  onInputChange = null
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl">
        {/* Icon */}
        <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-4 ${isDangerous ? 'bg-red-900/30' : 'bg-blue-900/30'}`}>
          <AlertCircle className={isDangerous ? 'text-red-400' : 'text-blue-400'} size={24} />
        </div>

        {/* Titre */}
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>

        {/* Message */}
        <p className="text-slate-300 mb-4">{message}</p>

        {/* Input si besoin */}
        {hasInput && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange && onInputChange(e.target.value)}
            placeholder="Entrez le nom..."
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 mb-4"
            autoFocus
          />
        )}

        {/* Boutons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition text-white ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
