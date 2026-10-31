import React, {useEffect, useRef, useState} from 'react';

export const FORM_ENDPOINT = 'https://formspree.io/f/mvkkblrn';

export default function InquiryDialog({initialCategory, onClose}) {
  const dialogRef = useRef(null);
  const sendingRef = useRef(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const sending = status === 'sending';

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    dialogRef.current.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  function close() {
    if (!sendingRef.current) onClose();
  }

  async function submit(event) {
    event.preventDefault();
    if (sendingRef.current || status === 'success') return;
    const data = new FormData(event.currentTarget);
    sendingRef.current = true;
    setStatus('sending');
    setError('');
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST', body: data, headers: {Accept: 'application/json'},
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        const messages = Array.isArray(result.errors)
          ? result.errors.map(item => item.message).filter(item => typeof item === 'string')
          : [];
        throw new Error(messages.join(' ') || 'Your inquiry could not be submitted. Please try again.');
      }
      setStatus('success');
    } catch (failure) {
      setStatus('error');
      setError(failure instanceof TypeError
        ? 'We could not confirm submission. Check your connection before trying again; your inquiry may already have been received.'
        : failure.message || 'Your inquiry could not be submitted. Please try again.');
    } finally {
      sendingRef.current = false;
    }
  }

  return <dialog ref={dialogRef} className="inquiry-dialog" aria-labelledby="brief-title"
    onCancel={event => {event.preventDefault(); close();}}
    onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) close();
    }}>
    <button className="close" type="button" aria-label="Close inquiry" disabled={sending} onClick={close}>×</button>
    <div className="eyebrow">LET’S MAKE IT SPECIFIC</div>
    <h2 id="brief-title">Request a quote.</h2>
    <div role="status" aria-live="polite">
      {status === 'success' && <p>Thank you. Your inquiry has been submitted. We’ll reply using the email address you provided.</p>}
    </div>
    {status === 'success' ? <button className="lime-btn" type="button" onClick={close}>Done</button> : <>
      <p>Tell us what you need and how to reach you. Your details will be sent through Formspree to our team for a response.</p>
      <form action={FORM_ENDPOINT} method="POST" onSubmit={submit} aria-busy={sending}>
        <input type="hidden" name="_subject" value="Next Layer Network — quote inquiry"/>
        <div className="form-trap" aria-hidden="true"><label>Leave this field empty<input name="_gotcha" tabIndex={-1} autoComplete="off"/></label></div>
        <fieldset disabled={sending}>
          <label>Your name<input name="name" required autoComplete="name" maxLength={150} autoFocus/></label>
          <label>Email address<input name="email" type="email" required autoComplete="email" maxLength={254}/></label>
          <label>Company / project<input name="company" required autoComplete="organization" maxLength={200}/></label>
          <label>What are you sourcing?<select name="category" defaultValue={initialCategory}>
            <option>Fiber assemblies</option><option>High-speed copper</option><option>Cabling essentials</option><option>Mixed requirement</option>
          </select></label>
          <label>Specifications, quantities & delivery<textarea name="message" required maxLength={10000} placeholder="Part numbers, lengths, quantities, destination, target date…"/></label>
          <button className="lime-btn" type="submit">{sending ? 'Sending…' : 'Send inquiry ↗'}</button>
        </fieldset>
        <p className="status" role={status === 'error' ? 'alert' : 'status'}>{status === 'error' ? error : sending ? 'Sending your inquiry. Please keep this window open.' : ''}</p>
      </form>
    </>}
  </dialog>;
}
