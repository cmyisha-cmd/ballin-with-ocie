import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://ballin-with-ocie.onrender.com';

export default function Admin(){
  const [pass, setPass] = useState('');
  const [ok, setOk] = useState(false);
  …
