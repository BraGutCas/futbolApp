import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState('39'); // Por defecto seleccionamos la liga 39 (Premier League)
  const [selectedSeason, setSelectedSeason] = useState('2023'); // Por defecto seleccionamos el año 2023
  const [leagues, setLeagues] = useState([]); // Almacenamos las ligas disponibles

  // Función para obtener las ligas disponibles
  const fetchLeagues = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leagues');
      console.log('Ligas obtenidas:', response.data);  // Verifica la respuesta en la consola
      setLeagues(response.data.response);  // Asumiendo que la respuesta tiene un campo "response"
    } catch (error) {
      console.error('Error al obtener las ligas:', error);
    }
  };

  // Función para obtener los partidos basados en la liga y temporada seleccionados
  const fetchFootballMatches = async (league, season) => {
    try {
      setLoading(true); // Indicamos que está cargando los partidos
      const response = await axios.get(`http://localhost:5000/api/football-matches?league=${league}&season=${season}`);
      setMatches(response.data.response);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los partidos:', error);
      setLoading(false);
    }
  };

  // Ejecutar cuando se carga el componente
  useEffect(() => {
    fetchLeagues(); // Cargar las ligas disponibles solo una vez al montar el componente
  }, []);

  useEffect(() => {
    fetchFootballMatches(selectedLeague, selectedSeason); // Solo recarga los partidos si la liga o la temporada cambian
  }, [selectedLeague, selectedSeason]); // Dependencias: solo se ejecutará cuando cambien selectedLeague o selectedSeason

  // Ejecutar cuando cambian la liga o la temporada
  const handleLeagueChange = (event) => {
    setSelectedLeague(event.target.value);
  };

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  return (
    <div className="App">
      <h1>Partidos de Fútbol</h1>
      
      {/* Listas desplegables para seleccionar liga y temporada */}
      <div className="filters">
        <select onChange={handleLeagueChange} value={selectedLeague}>
          {leagues.length > 0 ? (
            leagues.map((league) => (
              <option key={league.league.id} value={league.league.id}>
                {league.league.name}
              </option>
            ))
          ) : (
            <option value="">Cargando ligas...</option>
          )}
        </select>

        <select onChange={handleSeasonChange} value={selectedSeason}>
          <option value="2023/24">2023</option>
          <option value="2022/23">2022</option>
          <option value="2021/22">2021</option>
          <option value="2020/21">2020</option>
          <option value="2019/20">2019</option>
          <option value="2018/19">2018</option>
          <option value="2017/18">2017</option>
          <option value="2016/17">2016</option>
          <option value="2015/16">2015</option>
          <option value="2014/15">2014</option>
          <option value="2013/14">2013</option>
          <option value="2012/13">2012</option>
          <option value="2011/12">2011</option>
          <option value="2010/11">2010</option>
          {/* Agrega más años según necesites */}
        </select>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="matches-list">
          {matches && matches.length > 0 ? (
            <ul>
              {matches.map((match, index) => (
                <li key={index} className="match-item">
                  <div className="match-details">
                    <h3>{match.league.name} - {new Date(match.fixture.date).toLocaleString()}</h3>
                    <p>Estadio: {match.fixture.venue.name}, {match.fixture.venue.city}</p>
                    <p><strong>{match.fixture.status.long}</strong> ({match.fixture.status.short})</p>
                    <p>
                      {match.fixture.status.long === "Match Finished" ? (
                        <span>Resultado: {match.goals.home} - {match.goals.away}</span>
                      ) : (
                        <span>En progreso...</span>
                      )}
                    </p>
                    <div className="teams">
                      <div className="home-team">
                        <img 
                          src={match.teams.home.logo} 
                          alt={`${match.teams.home.name} logo`} 
                          className="team-logo"
                        />
                        <span>{match.teams.home.name}</span>
                      </div>
                      <div className="away-team">
                        <img 
                          src={match.teams.away.logo} 
                          alt={`${match.teams.away.name} logo`} 
                          className="team-logo"
                        />
                        <span>{match.teams.away.name}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay partidos disponibles.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
