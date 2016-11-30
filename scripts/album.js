var $albumTitle             = $('.album-view-title');
var $albumArtist            = $('.album-view-artist');
var $albumReleaseInfo       = $('.album-view-release-info');
var $albumImage             = $('.album-cover-art');
var $albumSongList          = $('.album-view-song-list');
var $playerBarPlayPause     = $('.main-controls .play-pause')
var playButtonTemplate      = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate     = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton     = '<span class="ion-play"></span>';
var playerBarPauseButton    = '<span class="ion-pause"></span>';

var setCurrentAlbum = function(album) {
    currentAlbum = album;
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);    
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
 
    $albumSongList.empty();
 
    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow); 
    }
};

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
    }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');
    
    $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width(); 
        var seekBarFillRatio = offsetX / barWidth;
        
        if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);   
        }        
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    
    $seekBars.find('.thumb').mousedown(function(event) {
    
        var $seekBar = $(this).parent();
        
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            
            if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());   
            } else {
                setVolume(seekBarFillRatio);
            }
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
        
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(nextPrevSong);
    $nextButton.click(nextPrevSong);
    $playerBarPlayPause.click(togglePlayfromPlayerBar);
});

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

/* Assignment 19-Part A: getSong function:

the function takes one argument-songNumber
assigns currentlyPlayingSongNumber & currentSongFromAlbum a new value based on the new song number.

*/

var getSong = function(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audiourl,{
        formats: ['mp3'],
        preload: true
    });
    
    setVolume(currentVolume);
};

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
}

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

/* Assignment 19-Part B: getSongNumberCell function:

The function takes one argument-number
returns the song number element that corresponds to that song number.

*/

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

/* End assignment 19. */

var updatePlayerBarSong = function() {

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);

};

/*
Assignment 20:
A function so users can toggle play and pause from the playerbar

The function takes no arguments and works based on a conditional that:
    If a song is paused and the play button is clicked in the player bar, it will
        Change the song number cell from a play button to a pause button
        Change the HTML of the player bar's play button to a pause button
        Play the song
    If the song is playing (so a current sound file exist), and the pause button is clicked
        Change the song number cell from a pause button to a play button
        Change the HTML of the player bar's pause button to a play button
        Pause the song
*/

var togglePlayfromPlayerBar = function () {
    var $songRow = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    
    if (currentSoundFile && currentSoundFile.isPaused()) {
        $songRow.html(pauseButtonTemplate);
        $playerBarPlayPause.html(playerBarPauseButton);
        currentSoundFile.play();
    } else if (currentSoundFile) {
        $songRow.html(playButtonTemplate);
        $playerBarPlayPause.html(playerBarPlayButton);
        currentSoundFile.pause();
    }
};

// End assigment 20.

var createSongRow = function(songNumber, songName, songLength) {
    var template =
         '<tr class="album-view-song-item">'
        + '  <td class="song-item-number" data-song-number= "' + songNumber + '">' + songNumber + '</td>'
        + '  <td class="song-item-title">' + songName + '</td>'
        + '  <td class="song-item-duration">' + songLength + '</td>'
        + '</tr>'
        ;
 
    var $row = $(template);

    var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));
        
        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }

        if (currentlyPlayingSongNumber !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            getSong(songNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays()
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSongNumber= songNumber;
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});
            
            updatePlayerBarSong();
            
        } else if (currentlyPlayingSongNumber === songNumber) {
            if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
                updateSeekBarWhileSongPlays()
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause(); 
            }
        }
    };    

    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var nextPrevSong = function() {

    var $this = $(this);  
    if ( $this.hasClass('previous') ) {
        // Note the difference between this implementation and the one in
        // nextSong()
        var getLastSongNumber = function(index) {
            return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
        };

        var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
        // Note that we're _decrementing_ the index here
        currentSongIndex--;

        if (currentSongIndex < 0) {
            currentSongIndex = currentAlbum.songs.length - 1;
        }
    }
        
    else if ( $this.hasClass('next') ) {
        var getLastSongNumber = function(index) {
            return index == 0 ? currentAlbum.songs.length : index;
        };

        var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
        currentSongIndex++;

        if (currentSongIndex >= currentAlbum.songs.length) {
            currentSongIndex = 0;
        }
    }

    // Set a new current song
    getSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays()
    updatePlayerBarSong();
    //currentlyPlayingSongNumber = currentSongIndex + 1;
    //currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

/* Previous Assignment.
 When clicking on an album cover, the page toggles between the three album objects.
 so I need to add a mouse click event Listener, then I need to loop through the objects
 problem: upon mouse click the album jumps to albumTarek rather than albumMarconi and stops!!!
 1- Need to step through albums -- fixed with removing the for loop and replacing it setting i = 1 and 
                                   incrementing i at the end of the statement.
 2- Need to go back to albumPicasso when done! How can I resent a loop back to the beginning?!?!
 2 fixed with adding the if statement at array length and resetting i to 0.
 this is according the to assignment solution video. */
    
    var albumObjects = [albumPicasso, albumMarconi, albumTarek];
    var i = 1;
    $albumImage.click(function(clickEvent) {
        setCurrentAlbum(albumObjects[i]);
        i++;
        if (i == albumObjects.length) {
            i = 0;
        }
    });
 