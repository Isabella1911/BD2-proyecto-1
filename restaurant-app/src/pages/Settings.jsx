import { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProfileForm from '../components/settings/ProfileForm';
import AddressForm from '../components/settings/AddressForm';
import PreferencesForm from '../components/settings/PreferencesForm';
import { getUserSettings } from '../services/userService';

function Settings() {
  const [settings, setSettings] = useState({
    profile: {
      name: '',
      email: '',
      phone: '',
    },
    address: {
      street: '',
      city: '',
      reference: '',
    },
    preferences: {
      notifications: false,
      darkMode: false,
      favoriteCuisine: 'Guatemalteca',
    },
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getUserSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error al cargar settings:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleProfileChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
    }));
  };

  const handleAddressChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handlePreferenceToggle = (field) => {
    setSettings((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: !prev.preferences[field],
      },
    }));
  };

  const handleCuisineChange = (value) => {
    setSettings((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        favoriteCuisine: value,
      },
    }));
  };

  const handleSave = () => {
    alert('Cambios guardados correctamente');
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <PageHeader
        title="Configuración"
        subtitle="Administra la información de tu perfil, dirección y preferencias."
      />

      {isLoading ? (
        <LoadingSpinner text="Cargando configuración..." />
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <ProfileForm
            profile={settings.profile}
            onChange={handleProfileChange}
          />

          <AddressForm
            address={settings.address}
            onChange={handleAddressChange}
          />

          <PreferencesForm
            preferences={settings.preferences}
            onToggle={handlePreferenceToggle}
            onCuisineChange={handleCuisineChange}
          />

          <button
            onClick={handleSave}
            style={{
              padding: '1rem 1.2rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-bg)',
              fontWeight: 'bold',
              boxShadow: 'var(--shadow-soft)',
              justifySelf: 'start',
            }}
          >
            Guardar cambios
          </button>
        </div>
      )}
    </div>
  );
}

export default Settings;