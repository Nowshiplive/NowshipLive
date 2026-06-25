'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Company = {
  id: string;
  company_name: string;
  contact_name: string | null;
  current_carrier: string | null;
  daily_parcels: number | null;
  services_needed: string | null;
  status: string | null;
};

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [status, setStatus] = useState('Prospect');
  const [dailyParcels, setDailyParcels] = useState('');

  async function loadCompanies() {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setCompanies(data);
  }

  async function addCompany() {
    if (!companyName.trim()) return;

    const { error } = await supabase.from('companies').insert({
      company_name: companyName,
      contact_name: contactName,
      status,
      daily_parcels: dailyParcels ? Number(dailyParcels) : 0,
      owner: 'Jon'
    });

    if (!error) {
      setCompanyName('');
      setContactName('');
      setDailyParcels('');
      setStatus('Prospect');
      loadCompanies();
    } else {
      alert(error.message);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  const liveCustomers = companies.filter(c => c.status === 'Live Customer').length;
  const totalParcels = companies.reduce((sum, c) => sum + (c.daily_parcels || 0), 0);
  const prospects = companies.filter(c => c.status !== 'Live Customer').length;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">NOWSHIP <span>LIVE</span></div>
        <div className="nav">
          <div className="active">Dashboard</div>
          <div>Companies</div>
          <div>Pipeline</div>
          <div>Tasks</div>
          <div>Quotes</div>
          <div>Reports</div>
        </div>
      </aside>

      <main className="main">
        <div className="header">
          <div>
            <h1>Good morning Jon</h1>
            <div className="subtitle">Your live NowShip command centre</div>
          </div>
        </div>

        <section className="cards">
          <div className="card">
            <div className="label">Companies</div>
            <div className="value">{companies.length}</div>
          </div>
          <div className="card">
            <div className="label">Live Customers</div>
            <div className="value">{liveCustomers}</div>
          </div>
          <div className="card">
            <div className="label">Active Prospects</div>
            <div className="value">{prospects}</div>
          </div>
          <div className="card">
            <div className="label">Daily Parcels</div>
            <div className="value">{totalParcels}</div>
          </div>
        </section>

        <div className="form">
          <input placeholder="Company name" value={companyName} onChange={e => setCompanyName(e.target.value)} />
          <input placeholder="Contact name" value={contactName} onChange={e => setContactName(e.target.value)} />
          <input placeholder="Daily parcels" value={dailyParcels} onChange={e => setDailyParcels(e.target.value)} />
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option>Prospect</option>
            <option>Spoken To</option>
            <option>Rates Sent</option>
            <option>Trial Agreed</option>
            <option>Onboarding</option>
            <option>Live Customer</option>
            <option>Lost</option>
          </select>
          <button className="button" onClick={addCompany}>Add Company</button>
        </div>

        <section className="table">
          <div className="row header-row">
            <div>Company</div>
            <div>Contact</div>
            <div>Carrier</div>
            <div>Parcels</div>
            <div>Status</div>
          </div>

          {companies.map(company => (
            <div className="row" key={company.id}>
              <div><strong>{company.company_name}</strong></div>
              <div>{company.contact_name || '-'}</div>
              <div>{company.current_carrier || '-'}</div>
              <div>{company.daily_parcels || 0}</div>
              <div><span className="status">{company.status || 'Prospect'}</span></div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
