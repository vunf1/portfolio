import { useState } from 'preact/hooks'

export function ContactModal({ show, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    visitorName: '',
    visitorEmail: '',
    visitorCompany: '',
    contactReason: ''
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.visitorName.trim()) {
      newErrors.visitorName = 'Full name is required'
    }
    
    if (!formData.visitorEmail.trim()) {
      newErrors.visitorEmail = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.visitorEmail)) {
      newErrors.visitorEmail = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
      // Reset form
      setFormData({
        visitorName: '',
        visitorEmail: '',
        visitorCompany: '',
        contactReason: ''
      })
      setErrors({})
    }
  }

  if (!show) return null

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Unlock Contact Information</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="visitorName" className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  className={`form-control ${errors.visitorName ? 'is-invalid' : ''}`}
                  id="visitorName" 
                  name="visitorName"
                  value={formData.visitorName}
                  onChange={handleInputChange}
                  required
                />
                {errors.visitorName && (
                  <div className="invalid-feedback">{errors.visitorName}</div>
                )}
              </div>
              
              <div className="mb-3">
                <label htmlFor="visitorEmail" className="form-label">Email Address *</label>
                <input 
                  type="email" 
                  className={`form-control ${errors.visitorEmail ? 'is-invalid' : ''}`}
                  id="visitorEmail" 
                  name="visitorEmail"
                  value={formData.visitorEmail}
                  onChange={handleInputChange}
                  required
                />
                {errors.visitorEmail && (
                  <div className="invalid-feedback">{errors.visitorEmail}</div>
                )}
              </div>
              
              <div className="mb-3">
                <label htmlFor="visitorCompany" className="form-label">Company (Optional)</label>
                <input 
                  type="text" 
                  className="form-control"
                  id="visitorCompany" 
                  name="visitorCompany"
                  value={formData.visitorCompany}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="contactReason" className="form-label">Reason for Contact (Optional)</label>
                <select 
                  className="form-select"
                  id="contactReason" 
                  name="contactReason"
                  value={formData.contactReason}
                  onChange={handleInputChange}
                >
                  <option value="">Select a reason...</option>
                  <option value="job-opportunity">Job Opportunity</option>
                  <option value="project-collaboration">Project Collaboration</option>
                  <option value="consulting">Consulting</option>
                  <option value="networking">Networking</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Unlock Information
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Modal backdrop */}
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </div>
  )
}




