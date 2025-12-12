import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ListingPaymentFormProps {
  listingId: string;
  userEmail: string;
  userPhone: string;
  userFullName: string;
  onSuccess?: () => void;
}

const ListingPaymentForm: React.FC<ListingPaymentFormProps> = ({ listingId, userEmail, userPhone, userFullName, onSuccess }) => {
  const [fullName, setFullName] = useState(userFullName || '');
  const [email, setEmail] = useState(userEmail || '');
  const [phone, setPhone] = useState(userPhone || '');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => setScreenshotPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !screenshot) {
      toast.error('Tous les champs sont obligatoires.');
      return;
    }
    setIsSubmitting(true);
    try {
      // Encoder le screenshot en base64
      const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
      const screenshotBase64 = await toBase64(screenshot);

      // Détection de l'URL de la Netlify Function selon l'environnement
      let apiUrl = '/api/send-listing-payment';
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // En local, fallback sur l'URL Netlify dev si /api/ ne fonctionne pas
        apiUrl = '/.netlify/functions/send-listing-payment';
      }
      let res, data;
      try {
        res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listingId,
            fullName,
            email,
            phone,
            screenshotBase64,
            screenshotFilename: screenshot.name
          })
        });
        data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // Si la réponse n'est pas du JSON (ex: HTML), afficher une erreur claire
        toast.error("Erreur réseau ou API. Vérifiez que la Netlify Function est bien déployée.\nDétail: réponse non JSON reçue.");
        setIsSubmitting(false);
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l\'envoi');
      toast.success('Demande envoyée, nous validerons votre paiement rapidement !');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'envoi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-primary-100 animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-6 text-primary flex items-center justify-center gap-2">
        <span role="img" aria-label="paiement">💳</span> Paiement de l'annonce
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 font-semibold text-grey-800">Nom complet</label>
          <input type="text" className="input-field w-full rounded-lg border-2 border-primary-100 focus:border-primary-400 transition" value={fullName} onChange={e => setFullName(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-grey-800">Téléphone</label>
          <input type="tel" className="input-field w-full rounded-lg border-2 border-primary-100 focus:border-primary-400 transition" value={phone} onChange={e => setPhone(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-grey-800">Email</label>
          <input type="email" className="input-field w-full rounded-lg border-2 border-primary-100 focus:border-primary-400 transition" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-grey-800">Preuve de paiement <span className="text-xs text-grey-500">(screenshot)</span></label>
          <input type="file" accept="image/*" onChange={handleFileChange} required className="block w-full text-sm text-grey-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary hover:file:bg-primary-100" />
          {screenshotPreview && (
            <div className="mt-3 flex flex-col items-center">
              <img src={screenshotPreview} alt="Aperçu" className="rounded-lg shadow-md max-h-40 border border-primary-200" />
              <span className="text-xs text-grey-500 mt-1">Aperçu de la preuve</span>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center py-3 text-lg font-semibold rounded-xl shadow-card border border-primary-200 bg-primary hover:bg-primary-600 text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <LoadingSpinner size="small" className="text-white" />
          ) : (
            <>
              <span role="img" aria-label="envoyer">📤</span> Envoyer la demande
            </>
          )}
        </button>
        {isSubmitting && (
          <div className="flex justify-center mt-2">
            <span className="text-primary-600 text-sm animate-pulse">Envoi en cours...</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default ListingPaymentForm;
