var createSongRow = function(songNumber, songName, songLength){
    var template =
        '<tr class="album-view-song-item">'
    +   '   <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    +   '   <td class="song-item-title">' + songName + '</td>'
    +   '   <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
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
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});
            
            updatePlayerBarSong();
        }else if(currentPlayingSongNum === songNumber){
            if(currentSoundFile.isPaused()){
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
            }else{
                currentSoundFile.pause();
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
            }
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

var updateSeekBarWhileSongPlays = function(){
    if(currentSoundFile){
        currentSoundFile.bind('timeupdate', function(event){
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            
            setCurrentTimeInPlayerBar(filterTimeCode(this.getTime()));
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
    }
};

var setCurrentTimeInPlayerBar = function(currentTime){
    $('.seek-control .current-time').text(currentTime);
};

var setTotalTimeInPlayerBar = function(totalTime){
    $('.seek-control .total-time').text(totalTime);
};

var filterTimeCode = function(timeInSeconds){
    var seconds = Number.parseFloat(timeInSeconds);
    var wholeSec = Math.floor(seconds);
    var minutes = Math.floor(wholeSec / 60);
    var remainingSec = wholeSec % 60;
    
    var output = minutes + ':';
    if(remainingSec < 10){
        output += '0';
    }
    output += remainingSec;
    
    return output;
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio){
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function(){
    var $seekBars = $('.player-bar .seek-bar');
    
    $seekBars.click(function(event){
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();        
        var seekBarFillRatio = offsetX / barWidth;
        
        if($(this).parent().attr('class') == 'seek-control'){
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        }else{
            setVolume(seekBarFillRatio * 100);
        }
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    
    $seekBars.find('.thumb').mousedown(function(event){
        var $seekBar = $(this).parent();
        
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            
            if($seekBar.parent().attr('class') == 'seek-control'){
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            }else{
                setVolume(seekBarFillRatio * 100);
            }
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
        
        $(document).bind('mouseup.thumb', function(){
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
};

var trackIndex = function(album, song){
    return album.songs.indexOf(song);
};

var togglePlayFromPlayerBar = function(){
    if (currentSoundFile.isPaused()){
        currentSoundFile.play();
        $(this).html(playerBarPauseButton); getSongNumberCell(currentPlayingSongNum).html(pauseButtonTemplate);
    }else if(currentSoundFile){  
        currentSoundFile.pause();
        $(this).html(playerBarPlayButton); getSongNumberCell(currentPlayingSongNum).html(playButtonTemplate);    
    }
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
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
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
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    
    var lastSongNumber = getPrevPlayingSongNum(currSongIndex);
    getSongNumberCell(currentPlayingSongNum).html(pauseButtonTemplate);
    getSongNumberCell(lastSongNumber).html(lastSongNumber);
};

var setSong = function(songNumber){
    if(currentSoundFile){
        currentSoundFile.stop();
    }
    currentPlayingSongNum = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl,{
        formats: ['mp3'],
        preload: true
    });
    
    setVolume(currentVolume);
};

var seek = function(time){
    if(currentSoundFile){
        currentSoundFile.setTime(time);
    }
};

var setVolume = function(volume){
    if(currentSoundFile){
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(songNumber){
    return $('.song-item-number[data-song-number="' + songNumber + '"]');
};

var updatePlayerBarSong = function(){
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
    $('.currently-playing .artist-name').text(currentAlbum.artist);    
    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.duration));
};

//Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentPlayingSongNum = null;
var currentAlbum = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseButton = $('.main-controls .play-pause');

$(document).ready(function(){
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    
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
    $playPauseButton.click(togglePlayFromPlayerBar);
});