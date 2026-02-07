import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dateTime: '',
        venue: '',
        category: 'tech'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { theme } = useTheme();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await eventAPI.create(formData);
            navigate('/organizer');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['tech', 'cultural', 'sports', 'workshop', 'seminar', 'other'];

    return (
        <div className="page-container">
            <button className="btn btn-back" onClick={() => navigate('/organizer')}>
                ← Back to Dashboard
            </button>

            <div className={`form-card ${theme.upsideDown ? 'glitch-card' : ''}`}>
                <h1 className={`page-title ${theme.upsideDown ? 'glitch-text' : ''}`}>
                    ➕ Create New Event
                </h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="event-form">
                    <div className="form-group">
                        <label htmlFor="title">Event Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter event title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your event..."
                            rows="4"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="dateTime">Date & Time</label>
                            <input
                                type="datetime-local"
                                id="dateTime"
                                name="dateTime"
                                value={formData.dateTime}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="venue">Venue</label>
                            <input
                                type="text"
                                id="venue"
                                name="venue"
                                value={formData.venue}
                                onChange={handleChange}
                                placeholder="Event location"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-info">
                        <span className="info-icon">ℹ️</span>
                        <span>Events are created as drafts. Publish them when ready!</span>
                    </div>

                    <button
                        type="submit"
                        className={`btn btn-primary btn-full ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Event'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;
