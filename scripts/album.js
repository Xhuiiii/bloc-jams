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
        var songNumber = parseInt($(this).attr('data-song-number'));
        
        //If there's a song playing
        if(currentPlayingSongNum !== null){
            getSongNumberCell(currentPlayingSongNum).html(currentPlayingSongNum);
        }
        
        if(currentPlayingSongNum !== songNumber){
            //Switch from play -> pause when new song is playing
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            updatePlayerBarSong();
        }else if(currentPlayingSongNum === songNumber){
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            setSong(null);
        }
    }
    
    var onHover = function(event){
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if(songNumber !== currentPlayingSongNum){
            songNumberCell.html(playButtonTemplate);
        }
    };
    
    var offHover = function(event){
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if(songNumber !== currentPlayingSongNum){
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
    currentAlbum = album;
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

var trackIndex = function(album, song){
    return album.songs.indexOf(song);
};

var nextSong = function(){
    var getPrevPlayingSongNum = function(index){
        return index == 0? currentAlbum.songs.length : index;
    }
    
    var currSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currSongIndex++;
    
    if(currSongIndex >= currentAlbum.songs.length){
        currSongIndex = 0;
    }
    
    //Set a new current song (number is index + 1 e.g. song 1 has index 0)
    setSong(currSongIndex + 1);
    
    //Update player bar info
    updatePlayerBarSong();
    
    var lastSongNumber = getPrevPlayingSongNum(currSongIndex); 
    getSongNumberCell(currentPlayingSongNum).html(pauseButtonTemplate);
    getSongNumberCell(lastSongNumber).html(lastSongNumber);
};

var previousSong = function(){
    var getPrevPlayingSongNum = function(index){
        return index == (currentAlbum.songs.length - 1)? 1 : (index + 2);
    }
    
    var currSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currSongIndex--;
    
    if(currSongIndex < 0){
        currSongIndex = currentAlbum.songs.length - 1;
    }
    
    setSong(currSongIndex + 1);
    
    updatePlayerBarSong();
    
    var lastSongNumber = getPrevPlayingSongNum(currSongIndex);
    getSongNumberCell(currentPlayingSongNum).html(pauseButtonTemplate);
    getSongNumberCell(lastSongNumber).html(lastSongNumber);
};

var setSong = function(songNumber){
    currentPlayingSongNum = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
};

var getSongNumberCell = function(songNumber){
    return $('.song-item-number[data-song-number="' + songNumber + '"]');
};

var updatePlayerBarSong = function(){
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

//Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentPlayingSongNum = null;
var currentAlbum = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

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
    
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});