import { useState } from 'react'
import { Form, InputGroup, Button } from 'react-bootstrap'
import { EyeIcon, EyeOffIcon } from './icons'

function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  minLength,
  isInvalid,
  feedback,
}) {
  const [visible, setVisible] = useState(false)

  return (
    <Form.Group className="mb-3" controlId={id}>
      {label && <Form.Label>{label}</Form.Label>}
      <InputGroup hasValidation>
        <Form.Control
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          isInvalid={isInvalid}
        />
        <Button
          type="button"
          variant="outline-secondary"
          className="password-toggle-btn"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Nascondi password' : 'Mostra password'}
          tabIndex={-1}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
        {feedback && <Form.Control.Feedback type="invalid">{feedback}</Form.Control.Feedback>}
      </InputGroup>
    </Form.Group>
  )
}

export default PasswordField
