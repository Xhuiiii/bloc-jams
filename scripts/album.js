//Example album
var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/album_covers/01.png',
    songs:[
        {title: 'Blue', duration: '4:26'},
        {title: 'Green', duration: '3:14'},
        {title: 'Red', duration: '5:01'},
        {title: 'Pink', duration: '3:21'},
        {title: 'Magenta', duration: '2:15'}
    ]
};

//Another example album
var albumMarconi = {
    title: 'The telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/album_covers/20.png',
    songs:[
        {title: 'Hello Operator?', duration: '1:01'},
        {title: 'Ring, ring, ring', duration: '5:01'},
        {title: 'Fits in your pocket', duration: '3:21'},
        {title: 'Can you hear me now?', duration: '3:14'},
        {title: 'Wrong phone number', duration: '2:15'}
    ]
};

//Another album
var albumBieber = {
    title: 'Purpose',
    artist: 'Justin Bieber',
    label: 'DJ',
    year: '2015',
    albumArtUrl: 'assets/album_covers/02.png',
    songs:[
        {title: 'Mark my words', duration: '5:02'},
        {title: 'Sorry', duration: '3:04'},
        {title: 'I\'ll show you', duration: '3:54'},
        {title: 'What do you mean?', duration: '4:21'},
        {title: 'Love yourself', duration: '3:23'},
        {title: 'Purpose', duration: '4:12'}
    ]
};

var createSongRow = function(songNumber, songName, songLength){
    var template =
        '<tr class="album-view-song-item">'
    +   '   <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    +   '   <td class="song-item-title">' + songName + '</td>'
    +   '   <td class="song-item-duration">' + songLength + '</td>'
    +   '</tr>'
    ;
    return template;
};

var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list-body')[0];

var setCurrentAlbum = function(album){
    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);
    
    albumSongList.innerHTML = '';

    for(var i = 0; i < album.songs.length; i++){
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    }
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

//Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

window.onload = function(){
    setCurrentAlbum(albumPicasso);
    
    songListContainer.addEventListener("mouseover", function(event){
        if (event.target.parentElement.className === 'album-view-song-item'){
            event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;   
        }
    });
    
    var albums = [albumPicasso, albumMarconi, albumBieber];
    var index = 0;
    albumImage.addEventListener("click", function(event){
        index++;
        if(index == albums.length){
            index = 0;
        }
        setCurrentAlbum(albums[index]);
    });
    
    for(var i = 0; i < songRows.length; i++){
        songRows[i].addEventListener("mouseleave", function(event){
           //Select the first child element (song-item-number element)
            this.children[0].innerHTML = this.children[0].getAttribute('data-song-number');
        });    
    }
};