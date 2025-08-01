class LofiMusicPlayer {
    constructor() {
        this.audioPlayer = document.getElementById('audioPlayer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.stationName = document.getElementById('stationName');
        this.stationGenre = document.getElementById('stationGenre');
        this.stationsGrid = document.getElementById('stationsGrid');
        this.loading = document.getElementById('loading');
        this.visualizer = document.querySelector('.visualizer');
        
        this.stations = [];
        this.currentStationIndex = -1;
        this.isPlaying = false;
        this.isLoading = false;
        
        this.init();
    }
    
    async init() {
        this.setupEventListeners();
        await this.loadLofiStations();
        this.setVolume(70);
    }
    
    setupEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.previousStation());
        this.nextBtn.addEventListener('click', () => this.nextStation());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        
        this.audioPlayer.addEventListener('loadstart', () => this.setLoadingState(true));
        this.audioPlayer.addEventListener('canplay', () => this.setLoadingState(false));
        this.audioPlayer.addEventListener('error', () => this.handleAudioError());
        this.audioPlayer.addEventListener('ended', () => this.nextStation());
    }
    
    async loadLofiStations() {
        try {
            this.loading.style.display = 'block';
            
            // Get a random server from Radio Browser API
            const serverResponse = await fetch('https://de1.api.radio-browser.info/json/servers');
            const servers = await serverResponse.json();
            const randomServer = servers[Math.floor(Math.random() * servers.length)];
            const baseUrl = `https://${randomServer.name}`;
            
            // Search for lofi stations
            const searchQueries = ['lofi', 'lo-fi', 'chill', 'chillhop', 'study music'];
            let allStations = [];
            
            for (const query of searchQueries) {
                try {
                    const response = await fetch(`${baseUrl}/json/stations/search?name=${encodeURIComponent(query)}&limit=20&hidebroken=true&order=clickcount&reverse=true`);
                    const stations = await response.json();
                    allStations = allStations.concat(stations);
                } catch (error) {
                    console.warn(`Failed to fetch stations for query: ${query}`, error);
                }
            }
            
            // Remove duplicates and filter for working stations
            const uniqueStations = allStations.filter((station, index, self) => 
                index === self.findIndex(s => s.stationuuid === station.stationuuid) &&
                station.url_resolved && 
                station.url_resolved.trim() !== ''
            );
            
            // Sort by popularity (click count) and take top 20
            this.stations = uniqueStations
                .sort((a, b) => (b.clickcount || 0) - (a.clickcount || 0))
                .slice(0, 20);
            
            this.renderStations();
            this.loading.style.display = 'none';
            
            if (this.stations.length > 0) {
                this.selectStation(0);
            }
            
        } catch (error) {
            console.error('Error loading stations:', error);
            this.loading.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed to load stations. Please refresh the page.';
        }
    }
    
    renderStations() {
        this.stationsGrid.innerHTML = '';
        
        this.stations.forEach((station, index) => {
            const stationCard = document.createElement('div');
            stationCard.className = 'station-card';
            stationCard.innerHTML = `
                <h4>${this.escapeHtml(station.name || 'Unknown Station')}</h4>
                <p>${this.escapeHtml(station.tags || station.genre || 'Lofi Music')}</p>
                <p class="country">${this.escapeHtml(station.country || 'Unknown')}</p>
            `;
            
            stationCard.addEventListener('click', () => this.selectStation(index));
            this.stationsGrid.appendChild(stationCard);
        });
    }
    
    selectStation(index) {
        if (index < 0 || index >= this.stations.length) return;
        
        // Update UI
        document.querySelectorAll('.station-card').forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
        
        const station = this.stations[index];
        this.currentStationIndex = index;
        
        this.stationName.textContent = station.name || 'Unknown Station';
        this.stationGenre.textContent = station.tags || station.genre || 'Lofi Music';
        
        // Load the station
        this.loadStation(station);
    }
    
    async loadStation(station) {
        try {
            this.setLoadingState(true);
            
            // Click tracking for Radio Browser API
            fetch(`https://de1.api.radio-browser.info/json/url/${station.stationuuid}`, {
                method: 'GET',
                headers: {
                    'User-Agent': 'LofiMusicPlayer/1.0'
                }
            }).catch(() => {}); // Silent fail for click tracking
            
            this.audioPlayer.src = station.url_resolved;
            
            if (this.isPlaying) {
                await this.audioPlayer.play();
            }
            
        } catch (error) {
            console.error('Error loading station:', error);
            this.handleAudioError();
        }
    }
    
    async togglePlayPause() {
        if (this.currentStationIndex === -1 || this.isLoading) return;
        
        try {
            if (this.isPlaying) {
                this.audioPlayer.pause();
                this.setPlayingState(false);
            } else {
                await this.audioPlayer.play();
                this.setPlayingState(true);
            }
        } catch (error) {
            console.error('Error toggling playback:', error);
            this.handleAudioError();
        }
    }
    
    previousStation() {
        if (this.stations.length === 0) return;
        
        const newIndex = this.currentStationIndex <= 0 
            ? this.stations.length - 1 
            : this.currentStationIndex - 1;
        
        this.selectStation(newIndex);
    }
    
    nextStation() {
        if (this.stations.length === 0) return;
        
        const newIndex = this.currentStationIndex >= this.stations.length - 1 
            ? 0 
            : this.currentStationIndex + 1;
        
        this.selectStation(newIndex);
    }
    
    setVolume(volume) {
        this.audioPlayer.volume = volume / 100;
        this.volumeSlider.value = volume;
    }
    
    setPlayingState(playing) {
        this.isPlaying = playing;
        const icon = this.playPauseBtn.querySelector('i');
        
        if (playing) {
            icon.className = 'fas fa-pause';
            this.visualizer.classList.add('playing');
        } else {
            icon.className = 'fas fa-play';
            this.visualizer.classList.remove('playing');
        }
    }
    
    setLoadingState(loading) {
        this.isLoading = loading;
        this.playPauseBtn.disabled = loading;
        
        if (loading) {
            const icon = this.playPauseBtn.querySelector('i');
            icon.className = 'fas fa-spinner fa-spin';
        } else {
            this.setPlayingState(this.isPlaying);
        }
    }
    
    handleAudioError() {
        console.error('Audio playback error');
        this.setPlayingState(false);
        this.setLoadingState(false);
        
        // Try next station automatically
        setTimeout(() => {
            if (this.stations.length > 1) {
                this.nextStation();
            }
        }, 1000);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the player when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new LofiMusicPlayer();
});

// Handle background playback
document.addEventListener('visibilitychange', () => {
    // Audio continues playing in background automatically
    // This is just for any additional handling if needed
});
