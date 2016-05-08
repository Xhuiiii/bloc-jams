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
    var $row = $(template);
    
    var clickHandler = function(){
        var songNumber = $(this).attr('data-song-number');
        
        if(playingSongNum === null){
            $(this).html(pauseButtonTemplate);
            playingSongNum = songNumber;
        }else if(playingSongNum === songNumber){
            $(this).html(playButtonTemplate);
            playingSongNum = null;
        }else if(playingSongNum !== songNumber){
            var currentPlayingSongItem = $('.song-item-number[data-song-number="' + playingSongNum + '"]');
            currentPlayingSongItem.html(playingSongNum);
            $(this).html(pauseButtonTemplate);
            playingSongNum = songNumber;
        }
    }
    
    var onHover = function(event){
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');
        
        if(songNumber !== playingSongNum){
            songNumberCell.html(playButtonTemplate);
        }
    };
    
    var offHover = function(event){
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');
        
        if(songNumber !== playingSongNum){
            songNumberCell.html(songNumber);
        }
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    
    return $row;
};

var $albumTitle = $('.album-view-title');
var $albumArtist = $('.album-view-artist');
var $albumReleaseInfo = $('.album-view-release-info');
var $albumImage = $('.album-cover-art');
var $albumSongList = $('.album-view-song-list-body');

var setCurrentAlbum = function(album){
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    $albumSongList.empty();

    for(var i = 0; i < album.songs.length; i++){
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

//Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var playingSongNum = null;

$(document).ready(function(){
    setCurrentAlbum(albumPicasso);
    
    var albums = [albumPicasso, albumMarconi, albumBieber];
    var index = 0;
    $albumImage.click(function(){
        index++;
        if(index == albums.length){
            index = 0;
        }
        setCurrentAlbum(albums[index]);
    });
});