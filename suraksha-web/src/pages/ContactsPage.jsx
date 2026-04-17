import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContacts, addContact, deleteContact } from '../services/api';
import { UserPlus, Trash2, ArrowLeft, Phone, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactsPage = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Other');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await getContacts();
      setContacts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addContact({ name, phone, relationship });
      setName('');
      setPhone('');
      setRelationship('Other');
      fetchContacts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add contact';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this trusted contact?')) {
      try {
        await deleteContact(id);
        fetchContacts();
      } catch (err) {
        alert('Failed to delete contact');
      }
    }
  };

  return (
    <div className="contacts-container" style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-dark)',
      padding: '20px'
    }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <button 
          onClick={() => navigate('/map')}
          style={{ background: 'var(--bg-accent)', border: 'none', color: 'white', padding: '10px', borderRadius: '12px' }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Trusted Contacts</h1>
      </header>

      <form className="glass-card" onSubmit={handleAdd} style={{ padding: '20px', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '15px', color: 'var(--text-dim)' }}>Add New Contact</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'white' }}
          />
          <input 
            type="tel" 
            placeholder="Phone Number" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'white' }}
          />
          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            style={{ 
              background: 'rgba(0,0,0,0.3)', 
              border: '1px solid var(--glass-border)', 
              padding: '12px', 
              borderRadius: '10px', 
              color: 'white',
              appearance: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="Mom" style={{ background: '#222' }}>Mom</option>
            <option value="Sister" style={{ background: '#222' }}>Sister</option>
            <option value="Friend" style={{ background: '#222' }}>Friend</option>
            <option value="Colleague" style={{ background: '#222' }}>Colleague</option>
            <option value="Other" style={{ background: '#222' }}>Other</option>
          </select>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}
          >
            <UserPlus size={18} />
            {loading ? 'Adding...' : 'Add Contact'}
          </button>
        </div>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence>
          {contacts.map((contact) => (
            <motion.div 
              key={contact._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="glass-card" 
              style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'var(--bg-accent)', borderRadius: '50%' }}>
                  <UserIcon size={20} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '600' }}>{contact.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-dim)', fontSize: '13px' }}>
                    <Phone size={12} />
                    <span>{contact.phone} • {contact.relationship}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(contact._id)}
                style={{ background: 'transparent', border: 'none', color: '#e74c3c', padding: '8px' }}
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {contacts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
            <p>No trusted contacts added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsPage;
